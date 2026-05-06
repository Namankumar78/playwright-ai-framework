import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';


export async function validateTests(testCases: any) {

  // 📄 Read prompt file
  const promptPath = path.resolve('prompts/validate.prompt.txt');
  let promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // 🔄 Inject test cases
  const finalPrompt = promptTemplate.replace('{{testCases}}', testCases);

  const result = await model.generateContent(finalPrompt);
  return result.response.text();
}
