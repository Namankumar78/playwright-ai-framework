import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';

export async function generateNavigationPlan(manualTest: string) {  
  const promptPath = path.resolve('prompts/healing.prompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // 🔄 Inject test cases
  const finalPrompt = promptTemplate.replace('{{testCases}}', manualTest);

  return await model.generateContent(finalPrompt);
}
