import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';

export async function healAutomation(
  logs: string,
  analysis: string,
  domTimeline: any[],
  currentPageCode: string,
  pageFileName: string
) {
  // 📄 Read prompt file
  const promptPath = path.resolve('prompts/healing.prompt.txt');
  const promptTemplate = fs.readFileSync(promptPath, 'utf-8');

  // 🔄 Inject test cases
  const finalPrompt = promptTemplate
    .replaceAll('{{pageFileName}}', pageFileName)
    .replaceAll('{{logs}}', logs)
    .replaceAll('{{analysis}}', analysis)
    .replaceAll('{{domTimeline}}', JSON.stringify(domTimeline, null, 2))
    .replaceAll('{{currentPageCode}}', currentPageCode);

  const result = await model.generateContent(finalPrompt);

  return result.response.text();
}
