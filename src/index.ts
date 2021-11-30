#!/usr/bin/env node

// local test
// chmod -R 775 ./dist

import chalk from 'chalk'
import { resolve } from 'path'
import { download } from './download'
import { svgParser } from './svgParser'
import { getConfig, showErrorLog, showLog, Config } from './utils'
const commander = require('commander')

const defulatConfigPath = '/.pulliconfontrc'
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
  let config = null
  try {
    config = require(configPath) as Config
  } catch (e) {
    showErrorLog(`load config file failed. \n file path: \n${configPath}`)
    throw e
  }

  await download(
    getConfig(config)
  )

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
