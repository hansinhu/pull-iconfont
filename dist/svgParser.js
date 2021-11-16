"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgParser = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const svgParser = async (config) => {
    const jsPath = path_1.resolve(`${config.outputPath}/iconfont.js`);
    let code = fs_1.readFileSync(jsPath, 'utf8');
    // <svg><symbol
    // </symbol></svg>
    if (config.pickicons && config.pickicons.length) {
        const iconPicked = {};
        config.pickicons.forEach((icon) => {
            iconPicked[`${config.iconPrefix}-${icon}`] = icon;
        });
        console.log('iconPicked:', iconPicked);
        const res = code.replace(/<svg>(.*)?<\/svg>/ig, (match, p1) => {
            const nodes = p1.split("<symbol ");
            const resultNodes = nodes.map((icon) => {
                const id = (icon.match(/id="([^"]*)"/) || [])[1];
                if (id && iconPicked[id]) {
                    return `<symbol ${icon}`;
                }
                return '';
            });
            return `<svg>${resultNodes.join('')}</svg>`;
        });
        fs_1.writeFileSync(path_1.resolve(`${config.outputPath}/parsedCode-2.js`), res);
    }
    // const parsedCode = parse(code)
    // writeFileSync(resolve(`${config.outputPath}/parsedCode.js`), JSON.stringify(parsedCode))
    // console.log(code)
};
exports.svgParser = svgParser;
