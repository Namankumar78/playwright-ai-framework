import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';


/**
 * Generates Playwright automation tests with built-in 
 * Rate Limit (429) handling and retry logic.
 */
export async function generateTests(userPrompt: any) {

// 📄 Read prompt file
  const promptPath = path.resolve('prompts/generate.prompt.txt');
  let promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  let retries = 3;
  let delay = 21000; // 21 seconds (Gemini's typical retry window)

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[AI Generator] Attempt ${i + 1}: Generating tests...`);
      
      const result = await model.generateContent(`${promptTemplate}\n\nTask: ${userPrompt}`);
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