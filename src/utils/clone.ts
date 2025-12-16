import simpleGit, { SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";

// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"].map((frame) => {
      return chalk.green(frame);
    }),
  },
});
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
    console.log();
    console.log(chalk.green(`代码下载成功`));
    console.log(chalk.blackBright("==================="));
    console.log(chalk.blackBright("======欢迎使用Auraro-cli脚手架======="));
    console.log(chalk.blackBright("==================="));
    console.log(chalk.blackBright("======请使用pnpm install 安装依赖======"));
    console.log(chalk.blackBright("======请使用pnpm run dev 运行项目======"));
  } catch (e) {
    console.error(e);
  }
}
