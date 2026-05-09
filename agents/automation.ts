import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';

export async function generateAutomation(testCases: any) {
  // 📄 Read prompt file
  const promptPath = path.resolve('prompts/automate.prompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // 🔄 Inject test cases
  const finalPrompt = promptTemplate.replace('{{testCases}}', testCases);

  const result = await model.generateContent(finalPrompt);
  let text = result.response.text();

  // Clean markdown
  text = text.replace(/```json/g, '').replace(/```/g, '');

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('❌ JSON parsing failed');
    console.log(text);
    throw e;
  }
}
