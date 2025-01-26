const { exec } = require("node:child_process");

process.stdin.resume();

function handleSignal(signal) {
  exec("npm run postdev", () => {
    return signal;
  });
}

process.on("SIGINT", handleSignal);
