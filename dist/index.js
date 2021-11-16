#!/usr/bin/env node
"use strict";
// local test
// chmod -R 775 ./dist
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require('commander');
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const download_1 = require("./download");
const getOutPath_1 = require("./getOutPath");
const svgParser_1 = require("./svgParser");
let defulatConfigPath = '/.pulliconfontrc';
let configPath = '';
const defaultConfig = {
    downloadUrl: '',
    cookie: '',
    saveDemoFile: true,
    outputPath: './iconfont',
    iconPrefix: 'icon',
    pickicons: [],
    useSvg: false,
};
try {
    commander
        .version('1.0')
        .option('-c, --config <config>', 'config.js path')
        .action(function ({ config }) {
        configPath = path_1.resolve(config || defulatConfigPath);
    })
        .allowUnknownOption()
        .parse(process.argv);
}
catch (err) {
    console.log(err);
}
// 解析项目类型与名称
// const processArgs = process.argv.slice(2)
// if (processArgs && processArgs[1]) {
//   console.log(processArgs)
// }
async function main() {
    let config = null;
    try {
        config = require(configPath);
    }
    catch (e) {
        console.log(chalk_1.default.red(`load config file failed. \n file path: \n${configPath}`));
        throw e;
    }
    console.log(__dirname);
    await download_1.download({
        ...defaultConfig,
        ...config,
    });
    if (config.useSvg) {
        const outPath = getOutPath_1.getOutPath(config);
        svgParser_1.svgParser(config);
        console.log('useSvg', outPath);
    }
}
main()
    .then((res) => {
    console.log('end');
})
    .catch(err => {
    console.log();
    console.log('Aborting installation.');
    if (err.command) {
        console.log(`  ${chalk_1.default.cyan(err.command)} has failed.`);
    }
    else {
        console.log(chalk_1.default.red('Unexpected error. Please report it as a bug:'));
        console.log(err);
    }
    console.log();
    process.exit(1);
});
