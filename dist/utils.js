"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.showErrorLog = exports.showLog = exports.defaultConfig = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.defaultConfig = {
    downloadUrl: '',
    cookie: '',
    saveDemoFile: true,
    outputPath: './iconfont',
    iconPrefix: 'icon',
    pickicons: [],
    useSvg: false,
};
function showLog(msg) {
    return console.log(chalk_1.default.green(msg));
}
exports.showLog = showLog;
function showErrorLog(msg) {
    return console.log(chalk_1.default.red(msg));
}
exports.showErrorLog = showErrorLog;
function getConfig(config) {
    return {
        ...exports.defaultConfig,
        ...config,
    };
}
exports.getConfig = getConfig;
