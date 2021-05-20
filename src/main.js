import cli from "https://jspm.dev/arg@5.0.0";

import * as commands from "./commands.js";
import { color as c, ensure, error } from "./utils.js";
import { help } from "./help.js";
import version from "./version.js";

async function main() {
  const argv = cli({
    // Flags
    "--alias": [String],
    "--all": Boolean,
    "--help": Boolean,
    "--use": String,
    "--version": Boolean,

    // Aliases
    "-a": "--alias",
    "-h": "--help",
    "-A": "--all",
  }, { argv: Deno.args });

  const [cmd, ...args] = argv._;

  if (argv["--help"]) {
    console.log(help.info());
    return;
  }

  if (argv["--version"]) {
    console.log(version());
    return;
  }

  switch (cmd) {
    case "query":
      ensure({ value: args[0], error_msg: "Please provide a search argument" });

      commands.query(args[0]);
      break;

    case "add":
      ensure({ value: args[0], error_msg: "You need to provide a 'mark'" });
      ensure({
        value: args[1],
        error_msg: "You need to provide a 'value' for the mark",
      });

      commands.add(args[0], args[1], argv["--alias"] || []);
      break;

    case "set-alias":
      ensure({ value: args[0], error_msg: "You need to provide an 'alias'" });
      ensure({
        value: args[1],
        error_msg: "You need to provide a 'source' for that alias",
      });

      commands.set_alias(args[0], args[1], argv["--alias"] || []);
      break;

    case "remove":
      ensure({ value: args, error_msg: "You need to provide marks to delete" });

      commands.remove(args, argv["--all"] || false);
      break;

    case "update":
      ensure({ value: args[0], error_msg: "You need to provide a 'mark'" });
      ensure({
        value: args[1],
        error_msg: "You need to provide a 'value' for the mark",
      });

      commands.update(args[0], args[1], argv["--all"] || false);
      break;

    case "clear":
      commands.clear_marks();
      break;

    case "export":
      commands.export_marks();
      break;

    case "import":
      ensure({ value: args[0], error_msg: "You need to provide a 'filepath'" });

      await commands.import_marks(args[0]);
      break;

    case "list":
      await commands.list_marks();
      break;

    case "shell-jump":
      commands.shell_jump(args[0], argv["--use"] || "zi");
      break;

    case "help":
      help(args[0] || "");
      break;

    default:
      error(
        `Invalid command "${cmd}.\nUse the --help flag to"` +
          " find out more about the available commands",
      );
      Deno.exit(1);
      break;
  }
}

if (import.meta.main) {
  try {
    await main();
  } catch (e) {
    console.error(c.bold("Something went wrong\n"));
    console.error(c.red("Error") + ":", e.message);
  }
}
