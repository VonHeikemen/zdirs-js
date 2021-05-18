import c from "https://jspm.dev/ansi-colors@4.1.1";
import FuzzySearch from "https://jspm.dev/fuzzy-search@3.2.1";

c.enable = !Deno.noColors;

export const color = c;

export const Store = {
  get(key) {
    const current_value = localStorage.getItem(key);

    if (current_value == null) {
      error(`the mark "${key}" doesn't exists.`);
      const suggestion = suggest(Object.keys(localStorage), key);

      if (suggestion) {
        console.error(suggestion);
      }

      Deno.exit(1);
    }

    return current_value;
  },

  set(key, value, force = false) {
    const current_value = localStorage.getItem(key);

    if (force == false && current_value != null) {
      error(`the mark "${key}" already exists.`);
      Deno.exit(1);
    }

    localStorage.setItem(key.trim(), value);
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  key_exists(key) {
    const value = localStorage.getItem(key);
    return typeof value == "string";
  },

  validate_available(keys) {
    for (let k of keys) {
      const key = k.trim();
      if (this.key_exists(key)) {
        error(`The mark "${key}" already exists`);
        Deno.exit(1);
      }
    }
  },

  validate_keys(keys) {
    for (let k of keys) {
      const key = k.trim();
      if (this.key_exists(key) == false) {
        error(`The mark "${key}" doesn't exists`);
        Deno.exit(1);
      }
    }
  },
};

export function success(msg) {
  console.log(c.green("Success!"), msg ? "\n" + msg : "");
}

export function error(msg) {
  console.error(c.red("Error") + ":", msg);
}

export function suggest(data, input) {
  const fzf = new FuzzySearch(data, [], {
    caseSensitive: false,
  });
  const suggestion = fzf.search(input.trim());

  if (suggestion.length) {
    return `Did you mean?\n* ${suggestion.join("\n* ")}`;
  }

  return "";
}

export function ensure({ value, error_msg }) {
  const exit = () => {
    error(error_msg);
    Deno.exit(1);
  };

  if (value == null) {
    exit();
  }

  const is = Object.prototype.toString.call(value);

  if (is == "[object Array]" && value.join(" ").trim() === "") {
    exit();
  }

  if (is == "[object String]" && value.trim() === "") {
    exit();
  }
}
