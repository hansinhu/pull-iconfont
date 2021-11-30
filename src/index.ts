#!/usr/bin/env node

import chalk from 'chalk'
import { resolve } from 'path'
import { download } from './download'
import { svgParser } from './svgParser'
import { getConfig, showErrorLog, showLog, Config } from './utils'
const commander = require('commander')

const defulatConfigPath = './.pulliconfontrc'
let configPath = ''

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
  // Step1: 解析配置文件
  let configFile = null
  try {
    configFile = require(configPath) as Config
  } catch (e) {
    showErrorLog(`加载配置文件失败: \n${configPath}`)
    throw e
  }

  // Step2: 下载icon文件
  await download(
    getConfig(configFile)
  )

  // Step3: 如果是svg图标，解析选择需要的图标
  if (configFile.useSvg) {
    showLog('使用 svg 图标，通过 pickicons 解析需要的icon')
    svgParser(configFile)
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
