
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

// This is a placeholder for fetching and processing your help page content.
// In a real scenario, you might fetch this from a file, database, or a CMS.
// For this PoC, we'll try to approximate it.
async function getHelpContentAsText(): Promise<string> {
  // This is a simplified example. Ideally, you'd fetch the rendered HTML of your /help page
  // and then convert it to text. Since we can't directly fetch a Next.js page output
  // from a server flow easily without deploying it or complex setups,
  // we'll use a very simplified version of its intended text content.
  // A more robust solution would involve having the help content in a structured format (e.g., Markdown)
  // that can be easily read here.

  // For now, let's use a summarized version of what src/app/help/page.tsx contains.
  // This is a MAJOR simplification and will limit the chatbot's effectiveness.
  const rawHelpContent = `
    OfferFlow User Guide: Create, manage, and share professional offer sheets.
    Getting Started: Main navigation includes Home, Create Offer, Pricing, Settings, Profile, Language Selector.
    Creating & Editing Offer Sheet:
    1. Seller Info & Logo: Company details, logo. Defaults in Settings.
    2. Customer Info & Validity: Client details, currency, validity dates.
    3. Adding Products: Title, quantity, original price (excl. VAT), discounted unit price. Discounted Price VAT Type (Excludes/Includes VAT). Description, image. Drag to reorder.
    4. Price Summary: 'Prices include VAT' checkbox for final total. VAT Rate. Totals calculated.
    5. Notes / Terms & Conditions: Specific notes, payment terms. Defaults in Settings.
    Saving, Exporting & Sharing:
    - Save Offer Sheet: Saves to browser local storage. Access from Homepage.
    - Export Button: PDF, JPEG (Page 1), JSON Data (backup/import).
    - Share Offer Button: Uses device's native sharing for PDF (email, WhatsApp). Fallback to download & email draft.
    - Import Data Button: Load from JSON.
    Customizing Settings: Default seller info, logo, currency, language, terms.
    Managing Profile: Local user data.
    Pricing Page: Demo subscription plans.
    Troubleshooting: Pop-ups, Local Storage, Performance.
  `;
  return htmlToText(rawHelpContent, {
    wordwrap: 130,
  });
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
  return appSupportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appSupportPrompt',
  input: { schema: AppSupportInputSchema.extend({ helpContent: z.string() }) },
  output: { schema: AppSupportOutputSchema },
  prompt: `You are a helpful assistant for the "OfferFlow" application.
Your goal is to answer user questions about how to use the application based on the provided help documentation.
If the question is unrelated to the OfferFlow app or its features as described in the documentation, politely state that you can only answer questions about OfferFlow.
Be concise and helpful.

Here is the application's help documentation:
---
{{{helpContent}}}
---

User's question: "{{{question}}}"

Answer:`,
});

const appSupportChatFlow = ai.defineFlow(
  {
    name: 'appSupportChatFlow',
    inputSchema: AppSupportInputSchema,
    outputSchema: AppSupportOutputSchema,
  },
  async (input) => {
    const helpText = await getHelpContentAsText();
    const { output } = await prompt({ question: input.question, helpContent: helpText });
    return output || { answer: "I'm sorry, I couldn't process that request. Please try again." };
  }
);
