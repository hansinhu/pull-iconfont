"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutPath = void 0;
const path_1 = require("path");
function getOutPath(config) {
    return path_1.resolve(config.outputPath);
}
exports.getOutPath = getOutPath;
