
'use server';
/**
 * @fileOverview A basic app support chatbot flow.
 *
 * - appSupportFlow - A function that attempts to answer user questions based on help content.
 * - AppSupportInput - The input type for the appSupportFlow function.
 * - AppSupportOutput - The return type for the appSupportFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { htmlToText } from 'html-to-text';

const STYLED_OFFERFLOW = `<span style="font-weight:bold;color:#3F51B5">Offer</span><span style="font-weight:bold;color:#4CAF50">Flow</span>`;

// This is a placeholder for fetching and processing your help page content.
// In a real scenario, you might fetch this from a file, database, or a CMS.
async function getHelpContentAsText(): Promise<string> {
  console.log('[appSupportFlow] Starting getHelpContentAsText');
  // This is a more detailed summary based on src/app/help/page.tsx
  const rawHelpContent = `
    ${STYLED_OFFERFLOW} User Guide: Create, manage, and share professional offer sheets.

    Getting Started & Navigation:
    Welcome to ${STYLED_OFFERFLOW}! This guide will help you make the most of its features.
    The main navigation bar at the top includes:
    - Home: Access recent offers and create new ones.
    - Create Offer: Go directly to the offer sheet form.
    - Pricing: View available plans (placeholder).
    - Settings: Customize default seller info, logo, currency, language, and terms.
    - Profile: Manage your local user data (or account info if logged in).
    - Language Selector: Change the application's display language.

    Why Use OfferFlow? (Value & Benefits)
    While you can create offer sheets manually, OfferFlow is designed to save you time, enhance your professional image, and streamline your entire sales process.
    - Save Time & Reduce Errors: Stop building offers from scratch. OfferFlow handles all the calculations for totals, discounts, and VAT automatically, reducing the chance of costly mistakes.
    - Look Professional: Impress clients with clean, consistently formatted, and professional-looking offer sheets. Pro and Business plans allow you to add your own logo and remove our watermark, reinforcing your brand identity.
    - Work Faster (Pro/Business): Stop re-typing the same information. Save customer details and reuse them. Create offer templates from your most common product combinations to generate new offers in seconds.
    - Organize & Manage Your Offers: All your recent offers are saved locally and are easily accessible from the homepage. You can export offer data as JSON for backup or to move between devices.
    - Powerful Exports: Generate professional PDFs or JPEGs instantly. The Business plan adds CSV/Excel exports for easy integration with your accounting or inventory systems.
    - Team Collaboration (Business): Allow multiple team members to access and create offers under a single account, ensuring consistency across your organization.
    In short, OfferFlow is an investment in efficiency and professionalism, allowing you to focus on what you do best: selling.

    Creating & Editing an Offer Sheet:
    Navigate to 'Create Offer' or click 'Create New Offer Sheet' on the homepage.
    1. Seller Information & Logo:
       Enter your company's details (name, address, email, phone, ΓΕΜΗ). Upload your logo. You can set defaults in Settings.
    2. Customer Information & Offer Validity:
       Fill in your client's details (name, company, contact info, VAT, ΓΕΜΗ, address). Choose the offer currency (EUR, USD, GBP) and set validity dates (Offer Valid From, Offer Valid Until).
    3. Adding Products:
       - Click 'Add Product'.
       - Enter title, quantity, original unit price (excluding VAT), and the discounted unit price.
       - 'Discounted Price VAT Type': Choose if the discounted price you entered 'Excludes VAT' (it's a net price) or 'Includes VAT' (it's a gross price for that item). This affects how VAT is calculated if the main "Prices include VAT" checkbox in Price Summary is NOT checked.
       - Add a description and upload an image for each product.
       - Drag and drop products to reorder them.
    4. Price Summary:
       - The 'Prices include VAT' checkbox determines if the 'Discounted Unit Price' you entered for products is treated as VAT-inclusive *for the final total calculation* when adding VAT. If checked, the Grand Total is the sum of discounted prices, and Subtotal/VAT are derived. If unchecked, Subtotal is sum of net discounted prices, then VAT is added.
       - Set the VAT Rate (e.g., 24 for 24%).
       - Totals (Subtotal, VAT Amount, Grand Total) are calculated automatically.
    5. Notes / Terms & Conditions:
       Add any specific notes, payment terms, or other conditions. You can set default terms in Settings.

    Saving, Exporting & Sharing:
    - Saving (Save Offer Sheet): Saves your current offer sheet to your browser's local storage. Access it later from the Homepage.
    - Exporting (Export Button):
      - PDF: Generates a professional PDF document.
      - JPEG (Page 1): Creates an image of the first page of your offer.
      - JSON Data: Exports all offer data in JSON format, useful for backup or importing into another session/browser.
    - Sharing (Share Offer Button):
      This attempts to use your device's native sharing capabilities (e.g., to share the PDF via Email, WhatsApp, Messenger). If direct sharing isn't supported or fails, it will download the PDF and open your default email client with a pre-filled draft. You'll then need to manually attach the downloaded PDF.
    - Importing Data (Import Data Button):
      Allows you to load an offer sheet from a previously exported JSON file.

    Customizing Settings:
    Access the settings page via the header link to set default values for new offer sheets:
    - Branding & Seller Defaults: Set your default company logo, name, address, email, phone, and ΓΕΜΗ.
    - Localization: Choose your preferred application language and default currency (EUR, USD, GBP) for new offers.
    - Default Content: Set default terms and conditions text that will auto-populate in new offer sheets.

    Managing Your Profile:
    The Profile page allows you to save a display name or other notes locally in your browser. If user accounts are fully enabled and you are logged in, this page would show your account details. Online accounts are currently disabled; data is local.

    Pricing Page:
    The Pricing page displays available subscription plans. Currently, this section is for demonstration purposes and plans are not functional.

    Troubleshooting & Tips:
    - Pop-ups: Ensure your browser allows pop-ups from this site for PDF downloads and email drafts to open correctly.
    - Local Storage: Offer sheets and settings are saved in your browser's local storage. This means data is specific to the browser you are using and won't automatically sync across different devices or browsers unless you manually export/import JSON data or a future cloud sync feature is implemented.
    - Performance: If the app feels slow, ensure your internet connection is stable. Complex offer sheets with many high-resolution images might take longer to process for PDF/JPEG generation.
  `;
  const textContent = htmlToText(rawHelpContent, {
    wordwrap: 130,
  });
  console.log('[appSupportFlow] Help content length (text):', textContent.length);
  // console.log('[appSupportFlow] Help content (first 500 chars):', textContent.substring(0, 500));
  return textContent;
}


const AppSupportInputSchema = z.object({
  question: z.string().describe('The user\'s question about the app.'),
});
export type AppSupportInput = z.infer<typeof AppSupportInputSchema>;

const AppSupportOutputSchema = z.object({
  answer: z.string().describe('The chatbot\'s answer to the question.'),
});
export type AppSupportOutput = z.infer<typeof AppSupportOutputSchema>;

export async function askAppSupport(input: AppSupportInput): Promise<AppSupportOutput> {
  console.log('[appSupportFlow] Received input for askAppSupport:', JSON.stringify(input));
  return appSupportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appSupportPrompt',
  input: { schema: AppSupportInputSchema.extend({ helpContent: z.string() }) },
  output: { schema: AppSupportOutputSchema },
  prompt: `You are a helpful assistant for the "OfferFlow" application.
Your goal is to answer user questions about how to use the application based on the provided help documentation.
This includes answering questions about the value of the app and why a user should choose a paid plan.
If the question is unrelated to the OfferFlow app or its features as described in the documentation, politely state that you can only answer questions about OfferFlow.
If the documentation does not contain an answer to the user's question, politely state that you don't have that information.
Be concise and helpful.

Here is the application's help documentation:
---
{{{helpContent}}}
---

User's question: "{{{question}}}"

Based *only* on the documentation provided, what is the answer?
Answer:`,
});

const appSupportChatFlow = ai.defineFlow(
  {
    name: 'appSupportChatFlow',
    inputSchema: AppSupportInputSchema,
    outputSchema: AppSupportOutputSchema,
  },
  async (input) => {
    console.log('[appSupportFlow] Starting appSupportChatFlow with question:', input.question);
    const helpText = await getHelpContentAsText();
    
    console.log('[appSupportFlow] Calling LLM prompt...');
    try {
      const response = await prompt({ question: input.question, helpContent: helpText });
      console.log('[appSupportFlow] LLM response received. Full response object:', JSON.stringify(response, null, 2));

      const structuredOutput = response.output;

      if (structuredOutput && typeof structuredOutput.answer === 'string') {
        console.log('[appSupportFlow] Successfully extracted structured output:', JSON.stringify(structuredOutput));
        return structuredOutput;
      } else {
        console.error('[appSupportFlow] LLM did not return a valid structured output or answer field is missing/incorrect.');
        console.log('[appSupportFlow] Finish Reason:', response.candidates[0]?.finishReason);
        console.log('[appSupportFlow] Finish Message:', response.candidates[0]?.finishMessage);
        return { answer: "I'm sorry, I couldn't formulate a specific answer for that. Please try rephrasing your question or check the Help page directly." };
      }
    } catch (error) {
      console.error('[appSupportFlow] Error during LLM prompt execution:', error);
      // Consider re-throwing or returning a more specific error structure if needed client-side
      // For now, return a generic error message.
      return { answer: "I'm sorry, an unexpected error occurred while trying to get an answer. Please try again later." };
    }
  }
);
