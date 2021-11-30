import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { showLog, Config } from './utils'

const svgParser = async (config: Config) => {
  const jsPath = resolve(`${config.outputPath}/iconfont.js`)

  const code = readFileSync(jsPath, 'utf8')

  // <svg><symbol ****</symbol></svg>
  if (config.pickicons && config.pickicons.length) {

    const iconPicked: Record<string, string> = {}
    config.pickicons.forEach((icon) => {
      iconPicked[`${config.iconPrefix}-${icon}`] = icon
    })

    console.log('Picked SVG Icon:', iconPicked)

    // eslint-disable-next-line
    const res = code.replace(/<svg>(.*)?<\/svg>/ig, (match, p1) => {
      const nodes = p1.split('<symbol ')
      const resultNodes = nodes.map((icon: string) => {
        const id = (icon.match(/id="([^"]*)"/) || [])[1]
        if (id && iconPicked[id]) {
          return `<symbol ${icon}`
        }
        return ''
      })
      return `<svg>${resultNodes.join('')}</svg>`
    })

    writeFileSync(resolve(`${config.outputPath}/iconfont.js`), res)

    showLog('SVG图标解析完成')
  }
}

export {
  svgParser,
}
