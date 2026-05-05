import { GoogleGenerativeAI } from "@google/generative-ai";
import { aimodel } from '../playwright.config.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function analyzeFailure(logs: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: aimodel });

  const prompt = `
You are a senior QA automation expert.

Analyze the Playwright failure logs and return:

1. Root Cause
2. Fix Suggestion
3. Confidence (High/Medium/Low)
4. Category (Selector / Timing / API / Environment)

Logs:
${logs}
`;

  const res = await model.generateContent(prompt);
  return res.response.text();
}