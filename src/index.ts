import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
import { update } from "./command/update";
const program = new Command("auraro");
program.version(version, "-v, --version");

program
  .command("update")
  .description("更新脚手架 aurar-cli.")
  .action(async () => {
    await update()
  });

program
  .command("create")
  .description("Create a new project.")
  .argument("[name]", "项目名称")
  .action((dirname) => {
    create(dirname);
  });

program.parse();
