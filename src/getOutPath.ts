import { resolve } from "path";
import { Config } from "./utils.js";

function getOutPath(config: Config): string {
  return resolve(config.outputPath);
}

export { getOutPath };
