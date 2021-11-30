"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const fs_1 = __importDefault(require("fs"));
const getOutPath_1 = require("./getOutPath");
const utils_1 = require("./utils");
const request_1 = __importDefault(require("request"));
const path_1 = require("path");
const unzipper_1 = __importDefault(require("unzipper"));
const rimraf_1 = __importDefault(require("rimraf"));
const download = async function (config) {
    const outPath = (0, getOutPath_1.getOutPath)(config);
    (0, utils_1.showLog)(`outPath:${outPath}`);
    const existsOutDir = fs_1.default.existsSync(outPath);
    if (!existsOutDir) {
        fs_1.default.mkdirSync(outPath, { recursive: true });
    }
    const writeZipStream = fs_1.default.createWriteStream(`${outPath}/download.zip`);
    return new Promise((resolve, reject) => {
        request_1.default.get({
            url: config.downloadUrl,
            headers: {
                cookie: config.cookie,
            },
        })
            .on('response', async (response) => {
            console.log(response.req.path);
            if (response.req.path.startsWith('/errors')) {
                (0, utils_1.showErrorLog)('下载失败, 请检查 cookie 是否过期');
                throw new Error('下载失败');
            }
            (0, utils_1.showLog)(`statusCode: ${response.statusCode}`);
        })
            .on('error', (err) => {
            console.error(err);
        })
            .pipe(writeZipStream);
        writeZipStream.on('error', (err) => {
            console.log('eeeeeeerrror', err);
            reject(err);
        });
        writeZipStream.on('close', () => {
            (0, utils_1.showLog)('下载完成');
            const unzipStream = fs_1.default.createReadStream(`${outPath}/download.zip`);
            unzipStream.pipe(unzipper_1.default.Extract({ path: outPath }));
            unzipStream.on('close', () => {
                (0, utils_1.showLog)('解压完成');
                setTimeout(async () => {
                    const dirs = fs_1.default.readdirSync(outPath);
                    const fontDir = dirs.find((item) => item.includes('font_'));
                    const iconFiles = fs_1.default.readdirSync((0, path_1.join)(outPath, fontDir));
                    (0, utils_1.showLog)('拷贝文件');
                    // copy到outPath
                    iconFiles.filter((file) => {
                        return !!config.saveDemoFile || !file.includes('demo');
                    }).forEach(async (file) => {
                        try {
                            fs_1.default.copyFileSync((0, path_1.join)(outPath, fontDir, file), `${outPath}/${file}`);
                        }
                        catch (err) {
                            console.log(err);
                        }
                    });
                    // 删除过渡文件
                    try {
                        await rimraf_1.default.sync((0, path_1.join)(outPath, fontDir));
                        await rimraf_1.default.sync(`${outPath}/download.zip`);
                    }
                    catch (err) {
                        console.log(err);
                    }
                    resolve('success');
                }, 2000);
            });
            unzipStream.on('err', (err) => {
                console.log(err);
            });
        });
    });
};
exports.download = download;
