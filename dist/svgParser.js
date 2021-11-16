"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgParser = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const svgParser = async (config) => {
    const jsPath = path_1.resolve(`${config.outputPath}/iconfont.js`);
    const code = fs_1.readFileSync(jsPath, 'utf8');
    console.log(code);
};
exports.svgParser = svgParser;
