#!/usr/bin/env node

// local test
// chmod -R 775 ./dist

import chalk from 'chalk'
import { resolve } from 'path'
import { download } from './download'
import { svgParser } from './svgParser'
import { showErrorLog, showLog } from './utils'

const commander = require('commander')

export interface Config {
  downloadUrl: string;
  cookie: string;
  saveDemoFile: boolean; // 是否保存demo文件
  outputPath: string
  iconPrefix: string
  pickicons: string[]
  useSvg: boolean
}

const defulatConfigPath = '/.pulliconfontrc'
let configPath = ''

export const defaultConfig: Config = {
  downloadUrl: '',
  cookie: '',
  saveDemoFile: true, // 是否保存demo文件
  outputPath: './iconfont',
  iconPrefix: 'icon',
  pickicons: [],
  useSvg: false,
}

try {
  commander
    .version('1.0')
    .option('-c, --config <config>', 'config.js path')
    .action(({ config }: any) => {
      configPath = resolve(config || defulatConfigPath)
    })
    .allowUnknownOption()
    .parse(process.argv)
} catch (err) {
  console.log(err)
}

async function main() {
  let config = null
  try {
    config = require(configPath)
  } catch (e) {
    showErrorLog(`load config file failed. \n file path: \n${configPath}`)
    throw e
  }

  await download({
    ...defaultConfig,
    ...config,
  })

  if (config.useSvg) {
    console.log('useSvg:', true)
    svgParser(config)
  }
}

main()
  .then(() => {
    showLog('pull-iconfont end')
    showLog('code by hansinhu: https://github.com/hansinhu/pull-iconfont')
  })
  .catch((err) => {
    console.log('Aborting installation.')
    if (err.command) {
      console.log(`  ${chalk.cyan(err.command)} has failed.`)
    } else {
      showErrorLog('Unexpected error. Please report it as a bug:')
      console.log(err)
    }
    process.exit(1)
  })
