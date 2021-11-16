#!/usr/bin/env node

// local test
// chmod -R 775 ./dist

const commander = require('commander')
import chalk from 'chalk'
import { resolve } from 'path'
import { download } from './download'
import { getOutPath } from './getOutPath'
import { svgParser } from './svgParser'

export interface Config {
  downloadUrl: string;
  cookie: string;
  saveDemoFile: boolean; // 是否保存demo文件
  outputPath: string
  iconPrefix: string
  pickicons: string[]
  useSvg: boolean
}

let defulatConfigPath = '/.pulliconfontrc'
let configPath = '' 

export const defaultConfig: Config = {
  downloadUrl:'',
  cookie: '',
  saveDemoFile: true, // 是否保存demo文件
  outputPath: './iconfont',
  iconPrefix: 'icon',
  pickicons:[],
  useSvg: false,
}

try {
  commander
  .version('1.0')
  .option('-c, --config <config>', 'config.js path')
  .action(function ({ config }: any) {
    configPath = resolve(config || defulatConfigPath)
  })
  .allowUnknownOption()
  .parse(process.argv)

} catch (err) {
  console.log(err)
}


// 解析项目类型与名称
// const processArgs = process.argv.slice(2)
// if (processArgs && processArgs[1]) {
//   console.log(processArgs)
// }

async function main () {
  let config = null
  try {
    config = require(configPath);
  } catch (e) {
    console.log(chalk.red(`load config file failed. \n file path: \n${configPath}`))
    throw e;
  }

  console.log(__dirname)

  await download({
    ...defaultConfig,
    ...config,
  })

  if (config.useSvg) {
    const outPath = getOutPath(config)
    svgParser(config)
    console.log('useSvg', outPath)
  }
}

main()
  .then((res) => {
    console.log('end')
  })
  .catch(err => {
    console.log()
    console.log('Aborting installation.')
    if (err.command) {
      console.log(`  ${chalk.cyan(err.command)} has failed.`)
    } else {
      console.log(chalk.red('Unexpected error. Please report it as a bug:'))
      console.log(err)
    }
    console.log()
    process.exit(1)
  })