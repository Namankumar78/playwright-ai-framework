
import readline from 'readline';

export async function humanApproval(data:any) {
  console.log(data);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    rl.question("Approve? (yes/no): ", (ans) => {
      rl.close();
      resolve(ans === 'yes');
    });
  });
}
