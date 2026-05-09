import { model } from '../playwright.config.js';

export async function generateNavigationPlan(
  manualTest: string
) {
  const prompt = `
Convert this manual test into a browser navigation plan.

Return ONLY JSON.

FORMAT:
{
  "startUrl": "",
  "steps": []
}

TEST:
${manualTest}
`;

  return await model.generateContent(prompt);
}