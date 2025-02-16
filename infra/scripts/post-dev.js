const { spawn } = require("node:child_process");

process.stdin.resume();

function handleSignal(signal) {
  const child = spawn("npm", ["run", "postdev"], {
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    process.exit(0);
  });
}

process.on("SIGINT", handleSignal);
