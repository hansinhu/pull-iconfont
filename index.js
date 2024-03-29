#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const path = require('path')
const packageJson = require('./package.json');
const { download } = require('./src/download')
const getOutPath = require('./src/getOutPath')

let defulatConfigPath = '/.pulliconfontrc'
let defaultOutputPath = `${process.env.PWD}/iconfont`

const defaultConfig = {
  downloadUrl:'',
  cookie: '',
  saveDemoFile: true, // 是否保存demo文件
  outputPath: './iconfont',
  iconPrefix: 'icon',
  pickicons:[],
  useSvg: false,
}

commander
  .version(packageJson.version)
  .option('-c, --config <config>', 'config.js path')
  .action(function ({ config, output }) {
    configPath = path.resolve(config || defulatConfigPath)
  })
  .allowUnknownOption()
  .parse(process.argv)

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