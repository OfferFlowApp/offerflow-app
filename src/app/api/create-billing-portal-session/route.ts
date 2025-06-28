
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

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
    const authToken = request.headers.get('Authorization');
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }
    const token = authToken.substring(7);

    let decodedToken;
    try {
        decodedToken = await adminAuth.verifyIdToken(token);
    } catch(error) {
        return NextResponse.json({ error: { message: 'Invalid or expired token.' } }, { status: 401 });
    }
    
    const userId = decodedToken.uid;
    if (!userId) {
        return NextResponse.json({ error: { message: 'User not authenticated.' } }, { status: 401 });
    }

    const subRef = adminDb.collection('users').doc(userId).collection('subscription').doc('current');
    const subSnap = await subRef.get();
    
    if (!subSnap.exists) {
        return NextResponse.json({ error: { message: 'No active subscription found for this user.' } }, { status: 404 });
    }

    const stripeCustomerId = subSnap.data()?.stripeCustomerId;
    if (!stripeCustomerId) {
      return NextResponse.json({ error: { message: 'Stripe customer ID not found for this user.' } }, { status: 404 });
    }
    
    const origin = request.nextUrl.origin;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${origin}/profile`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Error creating Stripe billing portal session:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Stripe.errors.StripeError) {
        errorMessage = error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: { message: errorMessage } }, { status: 500 });
  }
}
