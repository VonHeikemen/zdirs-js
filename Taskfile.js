const entrypoint = "./src/main.js";
const STORAGE_LOCATION = "http://zdirs.local";
const EXECUTABLE_NAME = "zi";

const flags = [
  "--location",
  STORAGE_LOCATION,
];

run(Deno.args, {
  start(...args) {
    exec([
      "deno",
      "run",
      ...flags,
      entrypoint,
      ...args,
    ]);
  },
  async format() {
    const files = await get_source_files();

    exec([
      "deno",
      "fmt",
      "./Taskfile.js",
      ...files,
    ]);
  },
  install() {
    exec([
      "deno",
      "install",
      "--name",
      EXECUTABLE_NAME,
      ...flags,
      entrypoint,
    ]);
  },
  list() {
    console.log("Available tasks: ");
    Object.keys(this).forEach((k) => console.log(k));
  },
});

function run([name, ...args], tasks) {
  if (tasks[name]) {
    tasks[name](...args);
  } else {
    console.log(`Task "${name}" not found\n`);
    tasks.list();
  }
}

async function exec(args) {
  const proc = await Deno.run({ cmd: args }).status();

  if (proc.success == false) {
    Deno.exit(proc.code);
  }

  return proc;
}

async function get_source_files() {
  let files = [];

  const read_access = await Deno.permissions.request({ name: "read" });

  if (read_access.state == "granted") {
    for await (let value of Deno.readDir("./src")) {
      if (value.isFile) {
        files.push(`./src/${value.name}`);
      }
    }
  }

  return files;
}
