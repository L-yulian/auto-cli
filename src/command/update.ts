import process from "child_process";
import chalk from "chalk";
import ora from "ora";

const spinner = ora({
  text: "aurar-cli 正在更新...",
  spinner: {
    interval: 100,
    frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"].map((frame) => {
      return chalk.blue(frame);
    }),
  },
});

export function update() {
  spinner.start();
  process.exec("npm install -g aurar-cli@latest", (error) => {
    spinner.stop();
    if (!error) {
      console.log(chalk.green("更新成功"));
    } else {
      console.log(chalk.red(error));
    }
  });
}
