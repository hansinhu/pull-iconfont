import { readFileSync, writeFileSync } from 'fs'
import { parse } from '@babel/parser'
import { resolve } from 'path'
import chalk from 'chalk'
import { Config } from './index'

const svgParser = async (config: Config) => {

	const jsPath = resolve(`${config.outputPath}/iconfont.js`)

	let code = readFileSync(jsPath, 'utf8')

	// <svg><symbol
	// </symbol></svg>
	if (config.pickicons && config.pickicons.length) {

		const iconPicked: {
			[index:string]: string
		} = {}
		config.pickicons.forEach((icon) => {
			iconPicked[`${config.iconPrefix}-${icon}`] = icon
		})

		console.log('Picked SVG Icon:', iconPicked)

		const res = code.replace(/<svg>(.*)?<\/svg>/ig, (match, p1) => {
			const nodes = p1.split("<symbol ")
			const resultNodes = nodes.map((icon: string) => {
				const id = (icon.match(/id="([^"]*)"/) || [])[1]
				if (id && iconPicked[id]) {
					return `<symbol ${icon}`
				}
				return ''
			});

			

			return `<svg>${resultNodes.join('')}</svg>`
		})

		writeFileSync(resolve(`${config.outputPath}/iconfont.js`), res)

		console.log(chalk.green('SVG图标解析完成'));
	}
	// const parsedCode = parse(code)
	// writeFileSync(resolve(`${config.outputPath}/parsedCode.js`), JSON.stringify(parsedCode))
	// console.log(code)
}

export {
	svgParser,
}
