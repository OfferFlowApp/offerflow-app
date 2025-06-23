
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserSubscription, PlanId } from '@/lib/types';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let stripe: Stripe | undefined;
if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey);
} else {
  console.warn("Stripe secret key is not set. Stripe webhook functionality will be disabled.");
}

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error("[Stripe Webhook] Error: Stripe environment variables are not configured on the server.");
    return NextResponse.json({ error: 'Webhook processing error: server not configured.' }, { status: 500 });
  }

  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;
    try {
      if (!sig) {
        console.error("[Stripe Webhook] Error: Missing signature from webhook request.");
        return NextResponse.json({ error: 'Webhook signature verification failed. Missing signature.' }, { status: 400 });
      }
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error(`[Stripe Webhook] Error constructing event: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    console.log('[Stripe Webhook] Verified event:', event.type, event.id);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Stripe Webhook] Checkout session completed:', session.id);

        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as PlanId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!userId || !planId || !stripeCustomerId || !stripeSubscriptionId) {
          console.error('[Stripe Webhook] Missing metadata from checkout session:', session.id, session.metadata);
          return NextResponse.json({ error: 'Missing metadata from session.' }, { status: 400 });
        }

        const userSubRef = doc(db, 'users', userId, 'subscription', 'current');
        
        // Let's get the subscription object from Stripe to get the period dates
        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        const newSubscriptionData: UserSubscription = {
          planId: planId,
          status: 'active',
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId,
          currentPeriodStart: stripeSubscription.current_period_start * 1000, // Stripe uses seconds, convert to ms
          currentPeriodEnd: stripeSubscription.current_period_end * 1000,     // Stripe uses seconds, convert to ms
          offersCreatedThisPeriod: 0, // Reset on new subscription
        };

        // setDoc will create or overwrite the document
        await setDoc(userSubRef, newSubscriptionData, { merge: true });
        console.log(`[Stripe Webhook] User ${userId} subscription updated to ${planId}.`);
        break;
      
      // You can add more event handlers here in the future
      // case 'invoice.payment_succeeded':
      //   // Handle recurring payments
      //   break;
      // case 'customer.subscription.deleted':
      //   // Handle cancellations
      //   break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
