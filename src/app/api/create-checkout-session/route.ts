
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { PLANS } from '@/config/plans';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }
    if (!planId || (planId !== 'pro' && planId !== 'business')) {
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

    if (!stripeCustomerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        metadata: {
          firebaseUID: userId,
        },
      });
      stripeCustomerId = customer.id;
      
      // Save the new stripeCustomerId to the user's subscription document
      if (userSubSnap.exists()) {
        await updateDoc(userSubRef, { stripeCustomerId: stripeCustomerId });
      } else {
        // This case should ideally be handled by AuthContext creating a free sub record first, but as a fallback:
        await setDoc(userSubRef, { stripeCustomerId: stripeCustomerId, planId: 'free', status: 'active' }, { merge: true });
      }
    }

    // Create the checkout session
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
      // {CHECKOUT_SESSION_ID} is a Stripe variable and will be populated automatically
      success_url: `${request.nextUrl.origin}/profile?session_id={CHECKOUT_SESSION_ID}&payment_status=success`,
      cancel_url: `${request.nextUrl.origin}/pricing?payment_status=cancelled`,
      metadata: {
        userId: userId, // For webhook to identify the user
        planId: planId,   // For webhook to know which plan was purchased
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
