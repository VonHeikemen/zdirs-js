# zdirs

A glorified bookmark utility for the command line. Bookmark your most frequently used directories and jump to them with ease.

`zdirs` aims to provide two things: a cli utility called `zi` and a shell function called `z`. With `zi` you should be able to manage your "bookmarks". And `z` is what you'll use to jump to a directory.

**Do note**: I build this tool for educational purposes. It avoids any interaction with your system as much as possible (this could change in the future, if I find it annoying). It only requires reading access when importing bookmarks from a json file. It uses [deno](https://deno.land/)'s built-in mechanism to store data (localStorage), and relies on your shell for some things. But don't worry too much, I still think it can provide a good user experience.

## Getting started

Ensure you have `deno` installed. [Follow the instructions](https://deno.land/#installation).

### Installation

Use the `deno install` command with the following flags:

* `--name`: Name of the executable. I like the name `zi`.
* `--location`: A URL of your choice. This is required by `deno`, I think it uses it like a unique ID for the database. For more information checkout this: [Deno v1.10: Support for Web Storage API](https://deno.com/blog/v1.10#support-for-web-storage-api).

#### Download from github

```sh
deno install --name zi --location http://zdirs.local https://raw.githubusercontent.com/VonHeikemen/zdirs-js/v0.2.0/src/main.js
```

#### Or clone and install from your filesystem

```sh
git clone https://github.com/VonHeikemen/zdirs-js

cd zdirs-js

deno install --name zi --location http://zdirs.local ./src/main.js
```

## Usage

### Using the cli

#### `zi help [command]`

It displays information about a command like usage, available options and some examples.

#### `zi add mark path [OPTIONS]`

Register a "mark" in the database (deno's localStorage).

#### `zi set-alias alias mark [OPTIONS]`

Create an alias for a mark that is already in the database.

#### `zi update mark path [OPTIONS]`

Change the value of a mark in the database.

#### `zi remove mark [OPTIONS]`

Deletes a mark from the database.

#### `zi clear`

Remove all marks from the database.

#### `zi query mark`

Show the value of a mark.

#### `zi list`

Show all the marks and their values.

#### `zi export`

Show all the marks and their values in json format.

#### `zi import filepath`

Reads a json file and adds all the keys as marks in the database.

#### `zi shell-jump [syntax] [OPTIONS]`

Shows a shell function named `z` on the screen. This function is meant to be added to your shell's configuration file, because this is the only way `zi` can change the current working directory in your shell session.

### Command Line Options

- `-h`, `--help`<br/>
  Shows usage information.

- `-v`, `--version`<br/>
  Displays the current version of zi.

- `-a`, `--alias`<br/>
  Use it to add an alternate mark. Works with the `add` and `set-alias` commands.

- `-A`, `--all`<br/>
  When removing or updating, make sure the changes applies to the aliases too.

- `--use`<br/>
  Select a "json processor" to parse the exported marks.

### Shell integration

The command `shell-jump` will show you a function that you can add to a configuration file loaded by your shell. This function is called `z`, and once is loaded in your shell you will be able to jump to a mark.

Currently the first argument to `shell-jump` can be either "fish" or "posix". They will show you the `z` function implemented in those "languages".

In theory `zi` can be used in any shell that allows for the user to define their own functions. The only thing you need to do is call the `cd` command (or the equivalent) with the result of `zi query`. For example in bash you could do something like this.

The default implementions of `z` use `zi query` to choose the mark, this can be a bit slow (like 500 miliseconds or so), if you wish to make it faster you'll have to export your marks into a json file and use an alternate `z` implementation. Currently the `shell-jump` commands offers a couple of alternatives, one that uses `awk` and another that uses `jq`. Run `zi help shell-jump` for more information.

If you wish to discuss more alternatives you can do it [here](https://github.com/VonHeikemen/zdirs-js/discussions/2).

```sh
z () {
  cd $(zi query $@)
}
```

That's good. But I would recommend using something like this.

```sh
z () {
  if [ -z "$1" ]; then
    cd ~
    return
  fi

  local dest=$(zi query $@)

  if [ -z "$dest" ]; then
    return
  fi

  cd $dest
}
```

That's what `zi shell-jump posix` will show you. When everything is in place you should be able to navigate the filesystem using `z`.

```sh
z my-mark
```

### Examples

Create a mark:

```sh
zi add work ~/code/work
```

Add current working directory (bash):

Use `$PWD`, because `zi` can't handle relative paths. So, `./` and `../` wont be processed in any way. `~` is still okay to use.

```sh
zi add work $PWD
```

In posix compliant shells you can add `-` to go back to the previous directory.

```sh
zi add - -
```

Add more than one alias:

In here the marks `code`, `cod`, `c` will have the same value as `work`.

```sh
zi set-alias code work --alias cod --alias c
```

Update the value of a mark:

```sh
zi update work ~/workspace
```

Delete a mark and all its aliases:

```sh
zi remove work --all
```

Get the value of a mark:

```sh
zi query work
```

Export marks to a json file (bash):

```sh
zi export > dirs.json
```

Put the `z` function into a file (bash):

```sh
zi shell-jump > z.sh
```

## Development

When developing feel free to use the `Taskfile.js` script to initialize the project with the right parameters.

```sh
deno run --allow-run ./Taskfile.js start [command] [arguments]
```

I do find myself writing that command one too many times, so I have a way to make more convenient: [Extending the deno cli using a shell function](https://dev.to/vonheikemen/extending-the-deno-cli-using-a-shell-function-3ifh)

```sh
deno start [command] [arguments]
```

## Support

If you find this tool useful and want to support my efforts, [buy me a coffee ☕](https://www.buymeacoffee.com/vonheikemen).

[![buy me a coffee](https://res.cloudinary.com/vonheikemen/image/upload/v1618466522/buy-me-coffee_ah0uzh.png)](https://www.buymeacoffee.com/vonheikemen)
