import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
const program = new Command("auraro");
program.version(version, "-v, --version");

program
  .command("create")
  .description("Create a new project.")
//   .argument("name", "项目名称")
  .action((dirname) => {
    // if(dirname ) {
    create(dirname);
    // }
  });

program.parse();
