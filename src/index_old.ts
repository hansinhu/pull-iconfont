#!/usr/bin/env node
import chalk from "chalk";
import { resolve } from "path";
import { download } from "./download";
import { svgParser } from "./svgParser";
import { getConfig, showErrorLog, showLog, Config } from "./utils";
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
  .action(() => console.log("chatting with AI"));

// 设置默认命令为 chat
prog.command("start").action(main);
prog.command("").action(main);

// prog.parse(process.argv);
