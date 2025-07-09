# OfferFlow - Professional Offer Sheet Generator

OfferFlow is a web application built with Next.js, TypeScript, and Tailwind CSS, designed to help businesses create, manage, and share professional offer sheets with ease. It features a robust subscription system powered by Firebase and Stripe.

## Key Technologies

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI**: ShadCN UI Components & Tailwind CSS
- **Authentication**: Firebase Authentication (Email/Password, Google)
- **Database**: Firestore
- **Payments**: Stripe for subscriptions
- **Core Libraries**: React Hook Form, DND-Kit for drag-and-drop, jsPDF & html2canvas for exports.

---

## Final Steps to Go Live

Congratulations! The application code is now complete and ready for you to publish. The final steps involve creating your personal Firebase and Stripe accounts and connecting them to the application using your private API keys. This guide will walk you through the entire process, step by step.

### **Step 1: Upload Your Code to GitHub**

Before you can deploy your site, you need to upload your code to the empty GitHub repository you created.

1.  **Open a new terminal** in this development environment if you don't already have one open.
2.  Copy and paste the following single command into the terminal and press **Enter**:
    ```bash
    npm run github-upload
    ```
    This command will automatically handle all the steps: initializing Git, adding your files, creating a commit, and pushing them to your `OfferFlowApp/offerflow-app` repository on GitHub.

### **Step 2: Connect Firebase to GitHub**

1.  Go back to the Firebase "Set up App Hosting" page.
2.  **Refresh the page.**
3.  Under "Deployment settings," you should now be able to select **`main`** from the "Live branch" dropdown.
4.  Click **"Finish setup"**.

Firebase will now deploy your application. Once it's finished, it will give you your live public URL.

### **Step 3: Set Up Your Stripe Account & Webhook**

1.  **Create a Stripe Account**: Go to [Stripe.com](https://dashboard.stripe.com/register) and create an account.
2.  **Get Your API Key**: In the Stripe Dashboard, go to **Developers** -> **API keys**. Find your **Secret key** (`sk_...`) and paste it into your `.env.local` file for `STRIPE_SECRET_KEY`.
3.  **Create Products and Prices**:
    *   In the Stripe Dashboard, go to the **Products** section.
    *   Create two products: a "Pro Plan" and a "Business Plan".
    *   For **each** product, create two prices: one for monthly billing and one for yearly.
    *   After creating each price, Stripe will give you a **Price ID** (`price_...`). You will have four Price IDs in total.
4.  **Update Plan IDs in Code**:
    *   Open the file `src/config/plans.ts`.
    *   Replace the placeholder `stripePriceId` values with the four real Price IDs you just created in Stripe.
5.  **Set Up Webhook**:
    *   In Stripe, go to **Developers** -> **Webhooks**.
    *   Click **Add endpoint**. The URL is your new public URL from Firebase plus `/api/stripe-webhook`. (e.g., `https://your-app.web.app/api/stripe-webhook`).
    *   For the events, add: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
    *   Create the endpoint. Stripe will give you a **Webhook signing secret** (`whsec_...`). Copy this into your `.env.local` file for `STRIPE_WEBHOOK_SECRET`.

---

That's it! Once you've completed these steps, your application will be fully configured and operational.
