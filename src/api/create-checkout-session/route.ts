
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { PLANS } from '@/config/plans';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PlanId } from '@/lib/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }
    
    // Updated Plan ID check
    const validPlanIds: PlanId[] = ['pro-monthly', 'pro-yearly', 'business-monthly', 'business-yearly'];
    if (!planId || !validPlanIds.includes(planId)) {
      return NextResponse.json({ error: { message: 'Invalid plan ID.' } }, { status: 400 });
    }

    const planDetails = PLANS[planId];
    if (!planDetails || !planDetails.stripePriceId || planDetails.stripePriceId.startsWith('YOUR_')) {
      console.error(`Stripe Price ID not configured or is a placeholder for plan: ${planId}. Actual value: ${planDetails.stripePriceId}`);
      return NextResponse.json({ error: { message: 'Stripe Price ID not configured for this plan. Please check server logs.' } }, { status: 500 });
    }

    const userSubRef = doc(db, 'users', userId, 'subscription', 'current');
    const userSubSnap = await getDoc(userSubRef);
    let stripeCustomerId = userSubSnap.exists() ? userSubSnap.data()?.stripeCustomerId : undefined;

    // A user should only get a trial if they have never had a subscription before.
    // Our check here is if a subscription document exists for them at all.
    const allowTrial = !userSubSnap.exists();

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;
      // We don't create a subscription doc here anymore, it gets created by the webhook after successful checkout.
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
      } : undefined, // Add trial period if user is new
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
