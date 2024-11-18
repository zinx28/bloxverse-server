import { readdir, readdirSync, readFileSync } from "fs";
import { join } from "path";
import GameInstance from "../Class/Game";
import { NodeVM } from "vm2";

export default async function loadScripts(scriptPath: string): Promise<void> {
  try {
    console.log(scriptPath);
    const files = await readdirSync(scriptPath);

    // Anything you want to be able to access in scripts
    const sandbox = {
      GameInstance,
    };

    const vm = new NodeVM({
      console: "inherit",
      require: {
        external: true,
        builtin: ["fs", "path"], // fs, path built in
      },
      sandbox,
    });

    files.forEach(async (file) => {
      if (file.endsWith(".js")) {
        const scriptFilePath = join(scriptPath, file);
        try {
          await vm.run(readFileSync(scriptFilePath, "utf-8"), scriptFilePath);
          //require(scriptFilePath);
          console.log(`Loaded script: ${file}`);
        } catch (e) {
          console.error(`Failed to load script ${file}:`, e);
        }
      }
    });

    return Promise.resolve();
  } catch (err) {
    console.error("FAILED TO LOAD SCRIPTS");
  }
}
