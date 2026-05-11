import { model } from '../playwright.config.js';
//import { fetchJiraTicket } from './jiraFetcher.js';
import path from 'path';
import fs from 'fs';

/**
 * Generates Playwright automation tests with built-in
 * Rate Limit (429) handling and retry logic.
 */
export async function generateTests(userPrompt: any) {
  // 📄 Read prompt file
  const promptPath = path.resolve('prompts/generate.prompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');


//// Featching Jira ticket details (if needed for the prompt)
// const jiraId = 'PROJ-123'; // Example Jira ID, replace with dynamic value as needed
//  const jiraTicket = await fetchJiraTicket(jiraId);

//   const promptPath = path.resolve('prompts/jiraTest.prompt.txt');
//   const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

//   const finalPrompt = promptTemplate.replace(
//     '{{jiraTicket}}',
//     JSON.stringify(jiraTicket, null, 2)
//   );


  const retries = 1;
  const delay = 21000; // 21 seconds (Gemini's typical retry window)

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
          console.warn('[Quota Exceeded] Limit hit. Sleeping for 21s before retry...');
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        } else {
          throw (
            new Error(
              'Maximum retries reached. Please check your AI Studio quota: https://aistudio.google.com/app/plan_billing'
            ),
            { cause: error }
          );
        }
      }

      // If it's a different error (like a 404 or 500), throw it immediately
      console.error('[AI Generator Error]:', error.message);
      throw error;
    }
  }
}
