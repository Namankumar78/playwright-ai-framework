import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';

export async function healSelector(dom: any, failedLocator: any) {

  // 📄 Read prompt file
  const promptPath = path.resolve('prompts/healing.prompt.txt');
  let promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // 🔄 Inject test cases
  const finalPrompt = promptTemplate.replace('{{failedLocator}}', failedLocator).replace('{{dom}}', dom);

  const res = await model.generateContent(finalPrompt);
  return res.response.text().trim();
}