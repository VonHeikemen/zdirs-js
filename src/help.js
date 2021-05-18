import { suggest } from "./utils.js";

export function help(cmd) {
  const message = msg[cmd];

  if (message) {
    console.log(message);
  } else {
    console.error("Could not find the information you are looking for.");

    const suggestions = suggest(Object.keys(msg), cmd);

    if (suggestions) {
      console.error(suggestions);
    } else {
      console.error(
        "Use `zi --help` to find out about the available commands.",
      );
    }

    Deno.exit(1);
  }
}

const msg = {};

help.info = () => `
zi - A glorified bookmark utility for the command line.

  Bookmark your most frequently used directories and jump to them with ease.

  USAGE
      zi --help
      zi --version
      zi help [command]
      zi add mark path [OPTIONS]
      zi set-alias alias mark [OPTIONS]
      zi update mark path [OPTIONS]
      zi remove mark [OPTIONS]
      zi clear
      zi query mark
      zi list
      zi export
      zi import filepath
      zi shell-jump [syntax]

  SHELL INTEGRATION
      For this utility to change directory in your shell you'll need to add a function in the configuration 
      file of your shell. To help you with this \`zi\` offers the shell-jump command which will show you the
      function you'll need to use.

  CAVEAT
      \`zi\` was made for educational purposes, to see what it was like to create a tool with \`deno\` that
      didn't require the user to give any access to the system. Because of this self-imposed restriction \`zi\`
      can't handle relative paths. So, any path that has \`./\` or \`../\` won't be expanded. Using paths 
      relative to \`~\` is fine though, 'cause it will be processed by your shell before hand. In most
      popular shells you could use $PWD as a substitute to ./ so is not that bad.

  EXAMPLES
      Basic usage. For more information please refer to the \`help\` command.

      Create a mark with two aliases:
        zi add work ~/code/work --alias wo --alias w

      Update the value of a mark with all its aliases:
        zi update work ~/workspace --all

      Delete a mark and all its aliases:
        zi remove work --all

      Get the value of a mark:
        zi query work`;

msg.help = `
  It displays information about a command like usage, available options and some examples.

  USAGE
      zi help [command]

  EXAMPLES
      zi help shell-jump`;

msg.add = `
  Register a "mark" in the database (deno's localStorage).

  USAGE
      zi add mark path [OPTIONS]

  OPTIONS
      -a, --alias        Create an alternate mark for the given path

  EXAMPLES
      Create a mark:
        zi add work ~/code/work

      Create a mark with two aliases (w and wo):
        zi add work ~/code/work --alias w --alias wo

      Create aliases using the shorthand:
        zi add work ~/code/work -a w -a wo

      Add current working directory (bash):
        zi add work $PWD
    
      In posix compliant shells you can add \`-\` to go back to the previous directory.
        zi add - -`;

msg["set-alias"] = `
  Create an alias for a mark that is already in the database.

  USAGE
      zi set-alias alias mark [OPTIONS]

  OPTIONS
      -a, --alias        Add more aliases

  EXAMPLES
      Add an alias:
        zi set-alias code work

      Add more than one alias:
        zi set-alias code work --alias cod --alias c

      Use the shorthand:
        zi set-alias code work -a cod -a c`;

msg.update = `
  Change the value of a mark in the database.

  USAGE
      zi update mark path [OPTIONS]

  OPTIONS
      -A, --all        Update aliases too

  EXAMPLES
      Update a mark:
        zi update work ~/workspace

      Update mark and its aliases:
        zi update work ~/workspace --all`;

msg.remove = `
  Deletes a mark from the database.

  USAGE
      zi remove [marks...] [OPTIONS]

  OPTIONS
      -A, --all        Include aliases

  EXAMPLES
      Delete a mark:
        zi remove work

      Delete a mark and its aliases:
        zi remove work --all

      Delete a few marks and their aliases:
        zi remove work config pro -A`;

msg.clear = `
  Remove all marks from the database.

  USAGE
      zi clear
`;

msg.query = `
  Show the value of a mark.

  USAGE
      zi query mark

  EXAMPLE
      show the "work" mark:
        zi query work

      Change directory "manually" (bash):
        cd $(zi query work)`;

msg.list = `
  Show all the marks and their values.

  USAGE
      zi list`;

msg.export = `
  Show all the marks and their values in json format.

  USAGE
      zi export

  EXAMPLES
      Show marks in the screen:
        zi export

      Redirect output to a file (bash):
        zi export > dirs.json`;

msg.import = `
  Reads a json file and adds all the keys as marks in the database.

  Because this action requires access to your system it will prompt you to ask
  if it is okay to read the file.

  USAGE
      zi import filepath

  EXAMPLES
      zi import dirs.json`;

msg["shell-jump"] = `
  Shows a shell function named \`z\` on the screen. This function is meant to be added to your
  shell's configuration file, because this is the only way \`zi\` can change the current working
  directory.

  If you are using \`bash\` it recommended you add the function to your .bashrc.

  If you are using \`zsh\`, add it to .zshrc.

  if you are using \`fish\` it is recommended to put the function inside a file and then use
  the \`source\` command on that file.

  After adding the \`z\` function to your shell you should be able to jump to a mark like this:
    \`z work\`. Where "work" is the name of the mark.

  USAGE
      zi shell-jump [syntax]

  EXAMPLES
      Show default \`z\` function:
        zi shell-jump

      Show posix compliant version:
        zi shell-jump posix

      Show fish compatible function:
        zi shell-jump fish

      Redirect output to a file (bash):
        zi shell-jump > z.sh`;
