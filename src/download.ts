import fs from 'fs';
var request = require('request');
const path = require('path')
const chalk = require('chalk')
const unzip = require('unzipper')
const rimraf = require('rimraf')
import { getOutPath } from './getOutPath'

import { Config } from './index'

const download = async function (config: Config) {

  const outPath = getOutPath(config)

  console.log(chalk.green('config:'), config)

  console.log(chalk.green('outPath:'), outPath);

  const existsOutDir = fs.existsSync(outPath)
  if (!existsOutDir) {
    fs.mkdirSync(outPath, { recursive: true });
  }

  // const queryStr = Object.keys(config)
  //   .filter(key => ['spm', 'pid', 'ctoken'].includes(key))
  //   .map(key => `${key}=${config[key]}`)
  //   .join('&')

  const writeZipStream = fs.createWriteStream(`${outPath}/download.zip`)

  request.get({
    url: config.downloadUrl,
    headers: {
      cookie: config.cookie
    }
  })
  .on('response', async function(response: { statusCode: any; }) {
    console.log(response.statusCode)
  })
  .on('error', (err: any) => {
    console.error(err)
  })
  .pipe(writeZipStream)

  writeZipStream.on('error', function (err) {
    console.log(err);
  });

  writeZipStream.on('close', function () {
    console.log(chalk.green('下载完成'));

    const unzipStream = fs.createReadStream(`${outPath}/download.zip`)
    unzipStream.pipe(unzip.Extract({ path: outPath }))
    unzipStream.on('close', function () {
      console.log(chalk.green('解压完成'));
      setTimeout(async () => {
        const dirs = await fs.readdirSync(outPath)
        const fontDir = dirs.find(item => item.includes('font_'))
        const iconFiles = await fs.readdirSync(path.join(outPath, fontDir))
        console.log(chalk.green('拷贝文件'));
        console.log(chalk.green('code by hansinhu: https://github.com/hansinhu/pull-iconfont'));
        // copy到outPath
        iconFiles.filter(file => {
          return !!config.saveDemoFile || !file.includes('demo')
        }).forEach(async file => {
          try {
            await fs.copyFileSync(path.join(outPath, fontDir, file), `${outPath}/${file}`)
          } catch (err) {
            console.log(err)
          }
        })

        // 删除过渡文件
        try {
          await rimraf.sync(path.join(outPath, fontDir));
          await rimraf.sync(`${outPath}/download.zip`);
        } catch (err) {
          console.log(err)
        }
      }, 2000);
    });
  });
}

export {
  download
}
