#!/usr/bin/env node
export interface Config {
    downloadUrl: string;
    cookie: string;
    saveDemoFile: boolean;
    outputPath: string;
    iconPrefix: string;
    pickicons: string[];
    useSvg: boolean;
}
export declare const defaultConfig: Config;
