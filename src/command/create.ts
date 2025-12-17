import path from "path";
import fs from "fs-extra";
import { gt } from "lodash";
import axios, { AxiosResponse } from "axios";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { clone } from "../utils/clone";
import { name, version } from "../../package.json";
export interface TemplateInfo {
  name: string; // 模版名称
  description: string; // 模版描述
  downloadUrl: string; // 模版下载地址
  branch: string; // 分支
}

export function isOverwrite(filePath: string) {
  console.warn(`${filePath} 已存在，是否覆盖？`);
  return select({
    message: "是否覆盖？",
    choices: [
      { name: "覆盖", value: true },
      { name: "取消", value: false },
    ],
  });
}

export const getNpmInfo = async (name: string) => {
  const npmUrl = `https://registry.npmjs.org/${name}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (err) {
    console.error(err);
  }
  return res;
};

export const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  return data["dist-tags"].latest;
};

export const checkVersion = async (name: string, version: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  console.log("[ latestVersion ] >", latestVersion);
  console.log("[ version ] >", version);
  const need = gt(latestVersion, version);
  console.log("[ need ] >", need);
  if (need) {
    console.warn(
      `监测到aurar最新版本：${chalk.blackBright(
        latestVersion
      )}，当前版本${chalk.blackBright(version)}, 请更新！`
    );
    console.log(
      `可使用：${chalk.yellow(
        "npm install aurar-cli@latest"
      )}, 或者使用：${chalk.yellow("aurar-cli update")}更新`
    );
  }
  return need;
};

export const templates: Map<string, TemplateInfo> = new Map([
  [
    "Vite-vue3-Typescript-template",
    {
      name: "Vite-vue3-Typescript-template",
      description: "Vue3技术栈开发模版",
      downloadUrl: "https://gitee.com/L_yulian/admin-pro.git",
      branch: "master",
    },
  ],
  [
    "Vite-template",
    {
      name: "Vite-template",
      description: "Vue3技术栈开发模版",
      downloadUrl: "https://gitee.com/L_yulian/admin-pro.git",
      branch: "dev38",
    },
  ],
]);

export async function create(projectName?: any) {
  // 初始化模版列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  console.log("[ projectName ] >", projectName);
  if (!projectName || projectName.trim().length == 0) {
    projectName = await input({
      message: "请输入项目名称",
    });
  }

  // 判断项目是否存在, 若存在则询问是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const run = await isOverwrite(projectName);
    if (run) {
      await fs.remove(filePath);
    } else {
      return; // 不做任何处理，直接退出
    }
  }

  //   检测版本更新
  await checkVersion(name, version);

  const templateName = await select({
    message: "请选择模版",
    choices: templateList,
  });

  const info = templates.get(templateName);
  console.log("[ info ] >", info);
  if (info) {
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }
}
