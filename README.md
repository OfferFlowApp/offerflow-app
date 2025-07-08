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

### **Step 1: Open and Populate the `.env.local` File**

This file will hold all your secret API keys. The keys currently in this file are for the development environment only and **must be replaced**.

1.  In your project's file explorer, find and open the file named `.env.local`.
2.  Delete the existing placeholder content.
3.  Follow the instructions below to get your personal keys and paste them into this file. The `.env.example` file serves as a reference for what you need.

---

### **Step 2: Set Up Your **NEW** Firebase Project**

This is for your user database and cloud storage. It is crucial that you create a **new, personal project** for your live application.

1.  **Create a New Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Create a project"**. Do **not** use the existing `offerflow-dmswf` project, as that is for development only. Give your new project a unique name.
2.  **Create a Web App**: Once your new project is created, click the Web icon (`</>`) on the project overview page to add a new Web App.
3.  **Copy Firebase Keys**: Firebase will give you a `firebaseConfig` object. Copy the keys from this object into your `.env.local` file.
    *   `NEXT_PUBLIC_FIREBASE_API_KEY`
    *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    *   ...and so on for all the `NEXT_PUBLIC_FIREBASE_` keys.
4.  **Enable Services in Your New Project**:
    *   In the Firebase Console, go to **Authentication** -> **Sign-in method** and enable **Email/Password** and **Google**.
    *   Go to **Firestore Database** and **Create database**. Start in **test mode**.

---

### **Step 3: Set Up Your Stripe Account**

This is for handling customer subscriptions and payments.

1.  **Create a Stripe Account**: Go to [Stripe.com](https://dashboard.stripe.com/register) and create an account.
2.  **Get Your API Key**: In the Stripe Dashboard, go to **Developers** -> **API keys**. Find your **Secret key** (`sk_...`) and copy it into your `.env.local` file for `STRIPE_SECRET_KEY`.
3.  **Create Products and Prices**:
    *   In the Stripe Dashboard, go to the **Products** section.
    *   Create two products: a "Pro Plan" and a "Business Plan".
    *   For **each** product, create two prices: one for monthly billing and one for yearly.
    *   After creating each price, Stripe will give you a **Price ID** (`price_...`). You will have four Price IDs in total.
4.  **Update Plan IDs in Code**:
    *   Open the file `src/config/plans.ts`.
    *   Replace the placeholder `stripePriceId` values with the four real Price IDs you just created in Stripe. Make sure you match them correctly (e.g., the monthly Pro price ID goes into the `pro-monthly` plan).
5.  **Set Up Webhook**: This lets Stripe notify your app about payments.
    *   **Deploy your app first!** You need a public URL (e.g., `https://your-app.com`) before you can create the webhook.
    *   In Stripe, go to **Developers** -> **Webhooks**.
    *   Click **Add endpoint**. The URL is your public URL plus `/api/stripe-webhook`. (e.g., `https://your-app.com/api/stripe-webhook`).
    *   For the events, add: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`.
    *   Create the endpoint. Stripe will give you a **Webhook signing secret** (`whsec_...`). Copy this into your `.env.local` file for `STRIPE_WEBHOOK_SECRET`.

---

That's it! Once you've completed these steps, your application will be fully configured, operational, and ready for customers.

### Local Development Setup

To run this project on your local machine for testing or further development:

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    - Follow the "Final Steps to Go Live" guide above to create and populate your `.env.local` file with your keys.
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
