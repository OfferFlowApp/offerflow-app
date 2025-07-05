
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

## Getting Started

This project is designed to be set up and deployed in a cloud environment like Firebase App Hosting.

### Prerequisites

- Node.js (v18 or later)
- A Firebase Project
- A Stripe Account

### Local Development Setup

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    - Create a `.env.local` file in the root of the project.
    - Add your Firebase project configuration and Stripe API keys to this file. See the "Final Steps to Go Live" section in the app for detailed instructions.
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Core Features

- **Dynamic Offer Creation**: Add products, calculate prices, and set terms.
- **Cloud Storage**: Signed-in users' offers are saved to Firestore, accessible from any device.
- **Subscription Tiers**: Different feature sets (Pro, Business) are unlocked based on the user's Stripe subscription status.
- **PDF/JPEG/JSON Export**: Generate professional-looking documents or data exports.
- **Customization**: Users can set default information like their logo, currency, and terms.
- **Localization**: Supports English and Greek out of the box.
