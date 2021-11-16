import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Config } from './index'

const svgParser = async (config: Config) => {

	const jsPath = resolve(`${config.outputPath}/iconfont.js`)

	const code = readFileSync(jsPath, 'utf8')
	console.log(code)
}

export {
	svgParser,
}
