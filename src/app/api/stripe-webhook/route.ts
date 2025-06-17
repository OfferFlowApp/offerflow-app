
import { NextResponse, type NextRequest } from 'next/server';
// import Stripe from 'stripe'; // You'll need to install stripe
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserSubscription, PlanId } from '@/lib/types';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Get this from Stripe Dashboard

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    // const sig = request.headers.get('stripe-signature');

    // console.log("[Stripe Webhook] Received raw body:", rawBody.substring(0, 200) + "...");
    // console.log("[Stripe Webhook] Received signature:", sig);


    // let event: Stripe.Event;
    // try {
    //   if (!sig || !webhookSecret) {
    //     console.error("[Stripe Webhook] Error: Missing signature or webhook secret.");
    //     return NextResponse.json({ error: 'Webhook signature verification failed. Config missing.' }, { status: 400 });
    //   }
    //   event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    // } catch (err: any) {
    //   console.error(`[Stripe Webhook] Error constructing event: ${err.message}`);
    //   return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    // }

    // console.log('[Stripe Webhook] Verified event:', event.type, event.id);

    // For now, let's just log the event type and data without full verification
    // In a real app, you MUST verify the signature as shown above.
    const event = JSON.parse(rawBody); // THIS IS INSECURE FOR PRODUCTION - ONLY FOR INITIAL TESTING
    console.log('[Stripe Webhook] INSECURELY Parsed Event Type:', event.type);


    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any; // Stripe.Checkout.Session;
        console.log('[Stripe Webhook] Checkout session completed:', session.id);
        // Fulfill the purchase...
        // session.metadata.userId
        // session.metadata.planId
        // session.customer (stripeCustomerId)
        // session.subscription (stripeSubscriptionId)

        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as PlanId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!userId || !planId || !stripeCustomerId || !stripeSubscriptionId) {
          console.error('[Stripe Webhook] Missing metadata from checkout session:', session.id, session.metadata);
          return NextResponse.json({ error: 'Missing metadata from session.' }, { status: 400 });
        }

        const userSubRef = doc(db, 'users', userId, 'subscription', 'current');
        const newSubscriptionData: Partial<UserSubscription> = {
          planId: planId,
          status: 'active',
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId,
          currentPeriodStart: Date.now(), // Or from Stripe event
          // currentPeriodEnd will be set by Stripe for subscriptions
          // offersCreatedThisPeriod: 0, // Reset if needed
        };

        // If it's a subscription, Stripe sends `invoice.payment_succeeded` for recurring payments.
        // `checkout.session.completed` is for the initial setup.
        // You might also handle `customer.subscription.updated` or `customer.subscription.deleted`.

        await setDoc(userSubRef, newSubscriptionData, { merge: true });
        console.log(`[Stripe Webhook] User ${userId} subscription updated to ${planId}.`);
        break;

      // case 'invoice.payment_succeeded':
      //   const invoice = event.data.object as Stripe.Invoice;
      //   if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_create') {
      //     const stripeSubscriptionId = invoice.subscription as string;
      //     const stripeCustomerId = invoice.customer as string;
            // Query Firestore for user by stripeSubscriptionId or stripeCustomerId
            // Update their currentPeriodStart, currentPeriodEnd from invoice/subscription data
            // Reset offersCreatedThisPeriod if it's a new cycle
      //     console.log(`[Stripe Webhook] Invoice payment succeeded for subscription: ${stripeSubscriptionId}`);
      //   }
      //   break;

      // ... handle other event types
      default:
        console.log(`[Stripe Webhook] Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
