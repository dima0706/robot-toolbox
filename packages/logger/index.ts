import chalk from 'chalk';

export function error(err: Error | string) {
  const msg = typeof err === 'string' ? err : err.message;
  console.log(chalk.red('--- fail ---'));
  console.log(chalk.red(msg));
  console.log(chalk.red('--- fail ---'));
}
