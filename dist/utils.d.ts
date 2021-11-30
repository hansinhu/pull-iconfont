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
export declare function showLog(msg: string): void;
export declare function showErrorLog(msg: string): void;
export declare function getConfig(config: Partial<Config>): Config;
