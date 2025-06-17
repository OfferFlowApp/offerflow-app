
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { PLANS } from '@/config/plans';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; // Assuming you have this from your Firebase setup
import type { User } from 'firebase/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
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

    const userDocRef = doc(db, 'users', userId, 'subscription', 'current');
    const userDocSnap = await getDoc(userDocRef);
    let firebaseUserRecord: User | null = null;
    try {
        // This is a server-side operation, direct auth.currentUser won't work.
        // We need the user's email to create/lookup a Stripe customer.
        // For this example, we assume the client sends enough info or we fetch it.
        // In a real app, you might fetch the Firebase user by UID to get their email.
        // const adminAuth = getAuth(); // This would be Firebase Admin SDK if running in a trusted server environment
        // firebaseUserRecord = await adminAuth.getUser(userId);
        // For now, we'll assume client might need to send email or we look it up from a user profile collection if available
    } catch (error) {
        console.warn("Could not fetch Firebase user record to get email for Stripe customer:", error);
    }


    let stripeCustomerId = userDocSnap.exists() ? userDocSnap.data()?.stripeCustomerId : undefined;

    if (!stripeCustomerId) {
      // Create a new Stripe customer
      // We'd ideally use the user's email here. If firebaseUserRecord.email is available:
      // const customerEmail = firebaseUserRecord?.email;
      // For now, let's allow creating a customer without an email, or with a placeholder
      const customerParams: Stripe.CustomerCreateParams = {
        metadata: {
          firebaseUID: userId,
        },
      };
      // if (customerEmail) {
      //   customerParams.email = customerEmail;
      // }
      
      const customer = await stripe.customers.create(customerParams);
      stripeCustomerId = customer.id;
      
      // Save the new stripeCustomerId to the user's subscription document or a main user profile
      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, { stripeCustomerId: stripeCustomerId });
      } else {
        // This case should ideally be handled by AuthContext creating a free sub record first
        // But as a fallback:
        await setDoc(userDocRef, { stripeCustomerId: stripeCustomerId, planId: 'free', status: 'active' }, { merge: true });
      }
    }

    // For one-time payments or setting up subscriptions
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add other payment methods like 'ideal', 'paypal' etc.
      mode: 'subscription', // Use 'payment' for one-time purchases
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

    