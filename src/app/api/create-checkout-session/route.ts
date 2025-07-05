
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { PLANS } from '@/config/plans';
import { adminDb } from '@/lib/firebase-admin';
import type { PlanId } from '@/lib/types';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | undefined;
if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
  });
} else {
  console.warn("Stripe secret key is not set. Stripe functionality will be disabled.");
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: { message: 'Stripe is not configured on the server.' } }, { status: 500 });
  }

  try {
    const { planId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }
    
    const validPlanIds: PlanId[] = ['pro-monthly', 'pro-yearly', 'business-monthly', 'business-yearly'];
    if (!planId || !validPlanIds.includes(planId)) {
      return NextResponse.json({ error: { message: 'Invalid plan ID.' } }, { status: 400 });
    }

    const planDetails = PLANS[planId as PlanId];
    if (!planDetails || !planDetails.stripePriceId || planDetails.stripePriceId.startsWith('YOUR_')) {
      console.error(`Stripe Price ID not configured or is a placeholder for plan: ${planId}. Actual value: ${planDetails?.stripePriceId}`);
      return NextResponse.json({ error: { message: 'Stripe Price ID not configured for this plan. Please check server logs.' } }, { status: 500 });
    }

    const userDocRef = adminDb.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    let stripeCustomerId = userDocSnap.exists ? userDocSnap.data()?.stripeCustomerId : undefined;

    // A user should only get a trial if they have never had a subscription before.
    // Check for the existence of the subscription document.
    const userSubRef = adminDb.collection('users').doc(userId).collection('subscription').doc('current');
    const userSubSnap = await userSubRef.get();
    const allowTrial = !userSubSnap.exists;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;
      // Store it on the main user document immediately.
      await userDocRef.set({ stripeCustomerId: stripeCustomerId }, { merge: true });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: planDetails.stripePriceId,
          quantity: 1,
        },
      ],
      subscription_data: allowTrial ? {
          trial_period_days: 30,
      } : undefined,
      success_url: `${request.nextUrl.origin}/profile?session_id={CHECKOUT_SESSION_ID}&payment_status=success`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment_status=cancelled`,
      metadata: {
        userId: userId,
        planId: planId,
      }
    });

    if (!session.url) {
        return NextResponse.json({ error: { message: 'Could not create Stripe session. No URL returned.'}}, { status: 500 });
    }

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Stripe.errors.StripeError) {
        errorMessage = error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: { message: errorMessage } }, { status: 500 });
  }
}
