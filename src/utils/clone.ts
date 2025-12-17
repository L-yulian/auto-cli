import simpleGit, { SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
var figlet = require("figlet");
import log from "./log";
// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"].map((frame) => {
      return chalk.green(frame);
    }),
  },
});

const goodPrinter = async () => {
  try {
    // 使用更安全的字体加载方式，避免相对路径问题
    const data = await figlet("aurar-cli");
    console.log(chalk.rgb(40, 156, 193).visible(data));
  } catch (error) {
    console.log(error);

    //     // 如果字体加载失败，使用简单的ASCII艺术替代
    //     console.log(chalk.rgb(40, 156, 193).visible(`
    // =================================
    // ======欢迎使用aurar-cli脚手架======
    // =================================
    //     `));
  }
};

const getGitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 根目录
  binary: "git", // git 可执行文件的路径
  maxConcurrentProcesses: 6, // 最大的并发进程数
  trimmed: true,
};
export async function clone(
  url: string,
  projectName: string,
  options: any = []
) {
  const git = simpleGit(getGitOptions);
  try {
    await logger(git.clone(url, projectName, options), "代码下载中...", {
      estimate: 7000, //   预计耗时 7000ms
    });

    goodPrinter();
    console.log();
    console.log(chalk.blueBright("================================="));
    console.log(chalk.blueBright("======欢迎使用aurar-cli脚手架======"));
    console.log(chalk.blueBright("================================="));
    console.log();

    log.success(chalk.green(`项目创建成功: ${chalk.blueBright(projectName)}`));
    log.success("执行以下命令启动项目:");
    log.info(`cd ${chalk.blueBright(projectName)}`);
    log.info(`${chalk.yellow("pnpm ")} install`);
    log.info(`${chalk.yellow("pnpm ")} run dev`);
  } catch (e) {
    console.error(e);
  }
}
