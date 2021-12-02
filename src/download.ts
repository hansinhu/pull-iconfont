import fs, { promises as fsPromises } from 'fs'
import { getOutPath } from './getOutPath'
import { showLog, showErrorLog, Config } from './utils'
import request from 'request'
import { join } from 'path'
import unzipper from 'unzipper'
import rimraf from 'rimraf'
const { stat, mkdir, readdir, copyFile } = fsPromises

const fileExists = async (p: string) => !!(await stat(p).catch(e => false));

const download = async function (config: Config) {
  const outPath = getOutPath(config)

  showLog(`outPath:${outPath}`)

  const existsOutDir = await fileExists(outPath)
  if (!existsOutDir) {
    showLog('目标文件夹不存在，创建中...')
    await mkdir(outPath, { recursive: true })
  }

  const writeZipStream = fs.createWriteStream(`${outPath}/download.zip`)

  return new Promise((resolve, reject) => {
    request.get({
      url: config.downloadUrl,
      headers: {
        cookie: config.cookie,
      },
    })
    .on('response', async (response: any) => {
      console.log(response.req.path)
      if (response.req.path.startsWith('/errors')) {
        showErrorLog('下载失败, 请检查 cookie 是否过期')
        throw new Error('下载失败')
      }
      showLog(`statusCode: ${response.statusCode}`)
    })
    .on('error', (err: any) => {
      console.error(err)
    })
    .pipe(writeZipStream)

    writeZipStream.on('error', (err) => {
      console.log('eeeeeeerrror',err)
      reject(err)
    })

    writeZipStream.on('close', () => {
      showLog('下载完成')

      const unzipStream = fs.createReadStream(`${outPath}/download.zip`)
      unzipStream.pipe(unzipper.Extract({ path: outPath }))
      unzipStream.on('close', () => {
        showLog('解压完成')
        setTimeout(async () => {
          const dirs = await readdir(outPath)
          const fontDir = dirs.find((item) => item.includes('font_')) as string
          const iconFiles = await readdir(join(outPath, fontDir))
          showLog('拷贝文件')
          // copy到outPath
          iconFiles.filter((file) => {
            return !!config.saveDemoFile || !file.includes('demo')
          }).forEach(async (file) => {
            try {
              await copyFile(join(outPath, fontDir, file), `${outPath}/${file}`)
            } catch (err) {
              console.log(err)
            }
          })

          // 删除过渡文件
          try {
            await rimraf.sync(join(outPath, fontDir))
            await rimraf.sync(`${outPath}/download.zip`)
          } catch (err) {
            console.log(err)
          }
          resolve('success')
        }, 2000)
      })
      unzipStream.on('err', (err) => {
        console.log(err)
      })
    })
  })
}

export {
  download,
}
