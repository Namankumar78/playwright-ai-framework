import { GoogleGenerativeAI } from "@google/generative-ai";
import { aimodel } from '../playwright.config.js';

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

/**
 * Generates Playwright automation tests with built-in 
 * Rate Limit (429) handling and retry logic.
 */
export async function generateTests(userPrompt: any) {
  // Using 3.1 Flash: Faster and has a much higher free quota than Pro
  const model = genAI.getGenerativeModel({ model: aimodel });

  const systemInstruction = `
    You are an expert QA Automation Engineer. 
    Generate clean, modular Playwright tests using TypeScript.
    Use Page Object Model (POM) patterns where applicable.
    Output ONLY the code block.
  `;

  let retries = 3;
  let delay = 21000; // 21 seconds (Gemini's typical retry window)

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[AI Generator] Attempt ${i + 1}: Generating tests...`);
      
      const result = await model.generateContent(`${systemInstruction}\n\nTask: ${userPrompt}`);
      const response = await result.response;
      
      return response.text();

    } catch (error: any) {
      // Check if the error is a Rate Limit (429)
      if (error.status === 429) {
        if (i < retries - 1) {
          console.warn(`[Quota Exceeded] Limit hit. Sleeping for 21s before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; 
        } else {
          throw new Error("Maximum retries reached. Please check your AI Studio quota: https://aistudio.google.com/app/plan_billing");
        }
      }
      
      // If it's a different error (like a 404 or 500), throw it immediately
      console.error("[AI Generator Error]:", error.message);
      throw error;
    }
  }
}