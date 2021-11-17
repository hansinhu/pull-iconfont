"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const fs_1 = __importDefault(require("fs"));
var request = require('request');
const path = require('path');
const chalk = require('chalk');
const unzip = require('unzipper');
const rimraf = require('rimraf');
const getOutPath_1 = require("./getOutPath");
const download = async function (config) {
    const outPath = getOutPath_1.getOutPath(config);
    console.log(chalk.green('outPath:'), outPath);
    const existsOutDir = fs_1.default.existsSync(outPath);
    if (!existsOutDir) {
        fs_1.default.mkdirSync(outPath, { recursive: true });
    }
    // const queryStr = Object.keys(config)
    //   .filter(key => ['spm', 'pid', 'ctoken'].includes(key))
    //   .map(key => `${key}=${config[key]}`)
    //   .join('&')
    const writeZipStream = fs_1.default.createWriteStream(`${outPath}/download.zip`);
    return new Promise((resolve, reject) => {
        request.get({
            url: config.downloadUrl,
            headers: {
                cookie: config.cookie
            }
        })
            .on('response', async function (response) {
            console.log(response.statusCode);
        })
            .on('error', (err) => {
            console.error(err);
        })
            .pipe(writeZipStream);
        writeZipStream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
        writeZipStream.on('close', function () {
            console.log(chalk.green('下载完成'));
            const unzipStream = fs_1.default.createReadStream(`${outPath}/download.zip`);
            unzipStream.pipe(unzip.Extract({ path: outPath }));
            unzipStream.on('close', function () {
                console.log(chalk.green('解压完成'));
                setTimeout(async () => {
                    const dirs = await fs_1.default.readdirSync(outPath);
                    const fontDir = dirs.find(item => item.includes('font_'));
                    const iconFiles = await fs_1.default.readdirSync(path.join(outPath, fontDir));
                    console.log(chalk.green('拷贝文件'));
                    console.log(chalk.green('code by hansinhu: https://github.com/hansinhu/pull-iconfont'));
                    // copy到outPath
                    iconFiles.filter(file => {
                        return !!config.saveDemoFile || !file.includes('demo');
                    }).forEach(async (file) => {
                        try {
                            await fs_1.default.copyFileSync(path.join(outPath, fontDir, file), `${outPath}/${file}`);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    });
                    // 删除过渡文件
                    try {
                        await rimraf.sync(path.join(outPath, fontDir));
                        await rimraf.sync(`${outPath}/download.zip`);
                    }
                    catch (err) {
                        console.log(err);
                    }
                    resolve('success');
                }, 2000);
            });
        });
    });
};
exports.download = download;
