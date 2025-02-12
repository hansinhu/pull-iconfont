#!/usr/bin/env node
import sade from "sade";
import dotenv from "dotenv";
import { download } from "./download";
import { svgParser } from "./svgParser";
import { getConfig, showErrorLog, showLog, Config } from "./utils";
import { resolve } from "path";
import { readFileSync } from "fs";

dotenv.config();

// 读取配置函数
async function loadConfig(config: string) {
  let configPath = resolve(process.cwd(), config);
  // Step1: 解析配置文件
  let configFile = {} as Config;
  try {
    configFile = (await import(configPath)).default as Config;
    console.log("configFile", configFile);
  } catch (e) {
    showErrorLog(`加载配置文件失败: \n${configPath}`);
    throw e;
  }
  return configFile;
}

async function pullIcon(opts: any) {
  console.log("opts:", opts);
  const configPath = opts.config || ".pulliconfontrc.js"; // 如果用户没有指定则使用默认配置文件
  const config = await loadConfig(configPath);

  console.log("config", config);

  // Step2: 下载icon文件
  await download(getConfig(config));

  // Step3: 如果是svg图标，解析选择需要的图标
  if (config.useSvg) {
    showLog("使用 svg 图标，通过 pickicons 解析需要的icon");
    svgParser(config);
  }

  showLog("pull-iconfont end");
  showLog("code by hansinhu: https://github.com/hansinhu/pull-iconfont");
}

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

console.log("pull-iconfont version: ", pkg.version);

const prog = sade("pull-iconfont");
// 版本
prog
  .version(pkg.version)
  .option("-c, --config", "配置文件", ".pulliconfontrc.js");

// Chat command
prog
  .command("chat")
  .describe("Start a chat session with AI")
  .example("$ pull-iconfont chat")
  .action(() => console.log("chatting with AI!!"));

prog
  .command("start")
  .describe("下载 iconfont 文件")
  .example("$ pull-iconfont start")
  .action(pullIcon);

prog.parse(process.argv);
