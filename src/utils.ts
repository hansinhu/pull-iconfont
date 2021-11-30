import chalk from 'chalk'

export interface Config {
  downloadUrl: string;
  cookie: string;
  saveDemoFile: boolean; // 是否保存demo文件
  outputPath: string
  iconPrefix: string
  pickicons: string[]
  useSvg: boolean
}

export const defaultConfig: Config = {
  downloadUrl: '',
  cookie: '',
  saveDemoFile: true, // 是否保存demo文件
  outputPath: './iconfont',
  iconPrefix: 'icon',
  pickicons: [],
  useSvg: false,
}

export function showLog(msg: string) {
  return console.log(chalk.green(msg))
}

export function showErrorLog(msg: string) {
  return console.log(chalk.red(msg))
}

export function getConfig (config: Partial<Config>): Config {
  return {
    ...defaultConfig,
    ...config,
  }
}