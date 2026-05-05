import { GoogleGenerativeAI } from "@google/generative-ai";
import { aimodel } from '../playwright.config.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function healSelector(dom: any, failedLocator: any) {
  const model = genAI.getGenerativeModel({ model: aimodel });

  const prompt = `
A Playwright test failed due to broken locator.

FAILED LOCATOR:
${failedLocator}

DOM:
${dom}

Generate a better, stable Playwright locator.
Only return locator string.
`;

  const res = await model.generateContent(prompt);
  return res.response.text().trim();
}