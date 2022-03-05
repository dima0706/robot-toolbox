import chalk from 'chalk';

export function error(msg: string) {
  console.log(chalk.red('--- fail ---'));
  console.log(chalk.red(msg));
  console.log(chalk.red('--- fail ---'));
}
