import { error, Store, success } from "./utils.js";

export function add(key, value, aliases) {
  const all_keys = new Set([key].concat(aliases.filter(Boolean)));

  Store.validate_available(all_keys);

  for (let k of all_keys) {
    Store.set(k, value);
  }

  success("The mark has been added.");
}

export function set_alias(alias, source, extra_aliases) {
  const all_keys = new Set([alias].concat(extra_aliases.filter(Boolean)));
  const path = Store.get(source);

  Store.validate_available(all_keys);

  for (let k of all_keys) {
    Store.set(k, path);
  }

  success("The mark has been added.");
}

export function query(key) {
  console.log(Store.get(key));
}

export function update(key, value, update_all) {
  const old_value = Store.get(key);
  let entries = [];

  console.log(`Updating ${key}`);
  Store.set(key, value, true);

  if (update_all) {
    entries = Object.entries(localStorage);
  }

  for (let [k, path] of entries) {
    if (path == old_value) {
      console.log(`Updating ${k}`);
      Store.set(k, value, true);
    }
  }

  success(`The mark has been updated:
* from: ${old_value}
* to: ${value}`);
}

export function remove(keys, delete_all) {
  const input = new Set(keys.filter(Boolean));

  Store.validate_keys(input);

  if (delete_all == false) {
    input.forEach((k) => {
      console.log(`deleting "${k}": ${Store.get(k)}`);
      Store.remove(k);
    });

    return success("");
  }

  let paths = [];
  for (let key of input) {
    paths.push(Store.get(key));
  }

  for (let [key, value] of Object.entries(localStorage)) {
    if (paths.includes(value)) {
      console.log(`deleting "${key}": ${value}`);
      Store.remove(key);
    }
  }

  return success("");
}

export async function clear_marks() {
  let response = prompt("Are you sure? (y/n)\n>");
  response = response.trim().toLowerCase();

  const valid_response = ["y", "yes"];

  if (!valid_response.includes(response)) {
    return;
  }

  localStorage.clear();
  success("All the marks have been cleared");
}

export function export_marks() {
  const keys = Object.keys(localStorage).sort();
  const data = {};

  for (let key of keys) {
    data[key] = Store.get(key);
  }

  console.log(JSON.stringify(data, null, 2));
}

export async function import_marks(filepath) {
  const response = await Deno.permissions.request({
    name: "read",
    path: filepath,
  });

  if (response.state != "granted") {
    error(`Can't read file ${filepath}`);
    Deno.exit(1);
  }

  const input = await Deno.readTextFile(filepath).then(JSON.parse);
  const new_keys = Object.keys(input);

  Store.validate_available(new_keys);

  for (let [key, value] of Object.entries(input)) {
    Store.set(key, value);
  }

  success("Marks added.");
}

export function list_marks() {
  const keys = Object.keys(localStorage).sort();
  for (let key of keys) {
    console.log(`* ${key}: ${localStorage.getItem(key)}`);
  }
}

export function shell_jump(syntax) {
  switch (syntax) {
    case "posix":
      console.log(`
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
}`);
      break;

    case "fish":
      console.log(`
function z
  if test -z "$argv[1]"
    cd ~
    return
  end

  set --local dest (zi query $argv)

  if test -z "$dest"
    return
  end

  cd $dest
end

funcsave z`);
      break;

    default:
      shell_jump("posix");
      break;
  }
}
