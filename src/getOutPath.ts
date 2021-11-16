import { resolve } from 'path'
import { Config } from './index'

function getOutPath (config: Config) {
	return resolve(config.outputPath)
}

export {
	getOutPath
}