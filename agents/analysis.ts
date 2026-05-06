import { model } from '../playwright.config.js';
import path from 'path';
import fs from 'fs';

export async function analyzeFailure(logs: string): Promise<string> {

  // 📄 Read prompt file
    const promptPath = path.resolve('prompts/analysis.prompt.txt');
    let promptTemplate = fs.readFileSync(promptPath, 'utf-8');
  
    // 🔄 Inject test cases
    const finalPrompt = promptTemplate.replace('{{logs}}', logs);

  const res = await model.generateContent(finalPrompt);
  return res.response.text();
}