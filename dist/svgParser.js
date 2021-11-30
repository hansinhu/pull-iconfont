"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgParser = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const svgParser = async (config) => {
    const jsPath = (0, path_1.resolve)(`${config.outputPath}/iconfont.js`);
    const code = (0, fs_1.readFileSync)(jsPath, 'utf8');
    // <svg><symbol ****</symbol></svg>
    if (config.pickicons && config.pickicons.length) {
        const iconPicked = {};
        config.pickicons.forEach((icon) => {
            iconPicked[`${config.iconPrefix}-${icon}`] = icon;
        });
        console.log('Picked SVG Icon:', iconPicked);
        // eslint-disable-next-line
        const res = code.replace(/<svg>(.*)?<\/svg>/ig, (match, p1) => {
            const nodes = p1.split('<symbol ');
            const resultNodes = nodes.map((icon) => {
                const id = (icon.match(/id="([^"]*)"/) || [])[1];
                if (id && iconPicked[id]) {
                    return `<symbol ${icon}`;
                }
                return '';
            });
            return `<svg>${resultNodes.join('')}</svg>`;
        });
        (0, fs_1.writeFileSync)((0, path_1.resolve)(`${config.outputPath}/iconfont.js`), res);
        (0, utils_1.showLog)('SVG图标解析完成');
    }
};
exports.svgParser = svgParser;
