#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const path = require('path')
const packageJson = require('./package.json');
const { download } = require('./src/download')

let configPath = `${process.env.PWD}/.pulliconfontrc`
let defaultOutputPath = `${process.env.PWD}/iconfont`

commander
  .version(packageJson.version)
  .option('-c, --config <config>', 'config.js path')
  .action(function ({ config, output }) {
    if (config) {
      configPath = path.resolve(config)
    }
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
  }

  if (config) {
    const outputPath = config.outputPath ? path.resolve(config.outputPath) : defaultOutputPath
    console.log(`configPath: ${configPath}, \noutputPath: ${outputPath}`)
    download(config, outputPath)
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