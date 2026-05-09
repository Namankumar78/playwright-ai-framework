import { execSync } from 'child_process';
import fs from 'fs';

export async function runTests(): Promise<{ success: boolean; logs: string }> {
  try {
    execSync('npx playwright test --reporter=json > report.json', {
      stdio: 'inherit',
    });

    return { success: true, logs: '' };
  } catch {
    const logs = fs.readFileSync('report.json', 'utf-8');
    return { success: false, logs };
  }
}
