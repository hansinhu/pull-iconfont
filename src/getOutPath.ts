import { resolve } from 'path'
import { Config } from './index'

function getOutPath(config: Config): string {
  return resolve(config.outputPath)
}

export {
  getOutPath,
}
