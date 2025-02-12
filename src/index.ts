#!/usr/bin/env node

import chalk from "chalk";
import { resolve } from "path";
import { download } from "./download.js";
import { svgParser } from "./svgParser.js";
import { getConfig, showErrorLog, showLog, Config } from "./utils.js";
import sade from "sade";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8")
);

const prog = sade("pull-iconfont");
// 版本
prog
  .version(pkg.version)
  .option("-c, --config", "配置文件", ".pulliconfontrc.js");

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

prog
  .command("chat")
  .describe("Start a chat session with AI")
  .action(async () => console.log("chatting with AI"));

// 设置默认命令为 chat
prog.command("").action(async (opts) => {
  main(opts)
    .then(() => {
      showLog("pull-iconfont end");
      showLog("code by hansinhu: https://github.com/hansinhu/pull-iconfont");
    })
    .catch((err) => {
      console.log("Aborting installation.");
      if (err.command) {
        console.log(`  ${chalk.cyan(err.command)} has failed.`);
      } else {
        showErrorLog("Unexpected error. Please report it as a bug:");
        console.log(err);
      }
      process.exit(1);
    });
});

async function main(opts: any) {
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
}

prog.parse(process.argv);
