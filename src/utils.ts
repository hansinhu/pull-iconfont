import chalk from 'chalk'

export function showLog(msg: string) {
  return console.log(chalk.green(msg))
}

export function showErrorLog(msg: string) {
  return console.log(chalk.red(msg))
}
