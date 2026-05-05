import { GoogleGenerativeAI } from "@google/generative-ai";
import { aimodel } from '../playwright.config.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function validateTests(testCases: any) {
const model = genAI.getGenerativeModel({ model: aimodel });

  const prompt = `
  Validate and improve these test cases:
  - Remove duplicates
  - Add missing edge cases
  - Improve clarity

  ${testCases}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}