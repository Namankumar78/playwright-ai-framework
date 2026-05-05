import { GoogleGenerativeAI } from "@google/generative-ai";
import { aimodel } from '../playwright.config.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateAutomation(testCases: any) {
const model = genAI.getGenerativeModel({ model: aimodel });

  const prompt = `
You are a senior QA automation engineer.

Convert the given test cases into Playwright TypeScript framework using Page Object Model.

GOAL:
Generate a scalable, reusable automation framework.

RULES:

1. Identify logical pages from the flow
   - Create one Page Object per page
   - Name pages meaningfully (e.g., LoginPage, SearchPage, ProductPage)

2. Each Page Object should:
   - Contain locators
   - Contain reusable methods (actions + validations)
   - Use Playwright best practices

3. Test file should:
   - ONLY contain test steps
   - Call page methods (NO locators inside test)

4. Use:
   - page.getByRole()
   - page.getByText()
   - Avoid dynamic selectors
   - Use async/await

5. Handle:
   - Popups (gracefully with try/catch)
   - Navigation waits
   - Assertions using expect()

6. Output MUST be VALID JSON ONLY (no explanation)

FORMAT:

{
  "pages": [
    {
      "fileName": "PageName.ts",
      "code": "full code here"
    }
  ],
  "test": {
    "fileName": "test.spec.ts",
    "code": "full code here"
  }
}

Test Cases:
${testCases}

Output ONLY code. No explanation.
`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();

  // Clean markdown
  text = text.replace(/```json/g, '').replace(/```/g, '');

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("❌ JSON parsing failed");
    console.log(text);
    throw e;
  }
}