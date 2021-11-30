#!/usr/bin/env node
"use strict";
// local test
// chmod -R 775 ./dist
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const download_1 = require("./download");
const svgParser_1 = require("./svgParser");
const utils_1 = require("./utils");
const commander = require('commander');
const defulatConfigPath = '/.pulliconfontrc';
let configPath = '';
try {
    commander
        .version('1.0')
        .option('-c, --config <config>', 'config.js path')
        .action(({ config }) => {
        configPath = (0, path_1.resolve)(config || defulatConfigPath);
    })
        .allowUnknownOption()
        .parse(process.argv);
}
catch (err) {
    console.log(err);
}
async function main() {
    let config = null;
    try {
        config = require(configPath);
    }
    catch (e) {
        (0, utils_1.showErrorLog)(`load config file failed. \n file path: \n${configPath}`);
        throw e;
    }
    await (0, download_1.download)((0, utils_1.getConfig)(config));
    if (config.useSvg) {
        console.log('useSvg:', true);
        (0, svgParser_1.svgParser)(config);
    }
}
main()
    .then(() => {
    (0, utils_1.showLog)('pull-iconfont end');
    (0, utils_1.showLog)('code by hansinhu: https://github.com/hansinhu/pull-iconfont');
})
    .catch((err) => {
    console.log('Aborting installation.');
    if (err.command) {
        console.log(`  ${chalk_1.default.cyan(err.command)} has failed.`);
    }
    else {
        (0, utils_1.showErrorLog)('Unexpected error. Please report it as a bug:');
        console.log(err);
    }
    process.exit(1);
});
