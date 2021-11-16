const { svgParser } = require("../dist/svgParser.js")

svgParser({
	outputPath: './example/local/styles/iconfont',
	iconPrefix: 'icon',
	pickicons:[
		'user',
		'link',
	]
})
