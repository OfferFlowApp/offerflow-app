
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import type { UserSubscription, PlanId } from '@/lib/types';
import { adminDb } from '@/lib/firebase-admin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

let stripe: Stripe | undefined;
if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey);
} else {
  console.warn("Stripe secret key is not set. Stripe webhook functionality will be disabled.");
}

async function updateSubscription(subscription: Stripe.Subscription) {
    const stripeCustomerId = subscription.customer as string;
    
    // The plan ID should be in the metadata of the subscription price
    const planId = subscription.items.data[0]?.price?.metadata?.planId as PlanId;

    if (!planId) {
        console.error(`[Stripe Webhook] Price metadata is missing planId for subscription: ${subscription.id}`);
        // This can happen on plan cancellations where the price is deleted. The 'deleted' status is more important.
        if (subscription.status !== 'canceled') return;
    }
    
    const userQuery = await adminDb.collection('users').where('stripeCustomerId', '==', stripeCustomerId).limit(1).get();

    if (userQuery.empty) {
        // This might happen if a user is deleted from Firebase but not Stripe. It's safe to ignore.
        console.log(`[Stripe Webhook] Could not find user with Stripe Customer ID: ${stripeCustomerId}. This may not be an error.`);
        return;
    }
    const userId = userQuery.docs[0].id;

    const userSubRef = adminDb.collection('users').doc(userId).collection('subscription').doc('current');
    
    const newSubscriptionData: UserSubscription = {
      planId: planId || 'none', // Fallback to 'none' if planId is missing (e.g., on cancellation)
      status: subscription.status,
      stripeCustomerId: stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      currentPeriodStart: subscription.current_period_start * 1000,
      currentPeriodEnd: subscription.current_period_end * 1000,
      offersCreatedThisPeriod: 0, // Reset counter on any subscription update/renewal
    };
    
    await userSubRef.set(newSubscriptionData, { merge: true });
    console.log(`[Stripe Webhook] Subscription for user ${userId} updated. Status: ${subscription.status}, Plan: ${planId}`);
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
        const stripeCustomerId = session.customer as string;

        if (!userId || !stripeCustomerId) {
          console.error('[Stripe Webhook] Missing metadata from checkout session:', session.id, session.metadata);
          return NextResponse.json({ error: 'Missing metadata from session.' }, { status: 400 });
        }

        // Store the stripeCustomerId on the user document for future lookups
        const userDocRef = adminDb.collection('users').doc(userId);
        await userDocRef.set({ stripeCustomerId: stripeCustomerId }, { merge: true });
        console.log(`[Stripe Webhook] Stored Stripe Customer ID ${stripeCustomerId} for user ${userId}.`);

        // The subscription data will be set by the customer.subscription.created/updated events.
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        await updateSubscription(subscriptionUpdated);
        break;

      case 'invoice.payment_succeeded':
        // This event often fires for renewals. The `customer.subscription.updated` event will
        // also fire with the new billing period, which is our source of truth.
        // We can log this for diagnostics, but no separate action is needed.
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason === 'subscription_cycle') {
            const subscriptionId = invoice.subscription as string;
            const customerId = invoice.customer as string;
            console.log(`[Stripe Webhook] Subscription renewal payment succeeded for sub: ${subscriptionId}, customer: ${customerId}. The 'customer.subscription.updated' event will handle the state change.`);
        }
        break;
        
      case 'invoice.payment_failed':
        // The user's subscription status will automatically become 'past_due' or 'unpaid'.
        // The `customer.subscription.updated` event will fire, and we'll handle the status update there.
        // No direct action is needed here as the subscription status change is the trigger we care about.
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice payment failed for subscription: ${failedInvoice.subscription}`);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
