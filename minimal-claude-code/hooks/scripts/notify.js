#!/usr/bin/env node
const { execSync } = require("child_process");
const os = require("os");

const platform = os.platform();

try {
  if (platform === "darwin") {
    execSync("osascript -e 'beep 1'", { stdio: "ignore" });
  } else if (platform === "win32") {
    execSync('powershell -c "[console]::beep(800,200)"', { stdio: "ignore" });
  } else if (platform === "linux") {
    execSync("paplay /usr/share/sounds/freedesktop/stereo/bell.oga 2>/dev/null || echo -e '\\a'", {
      stdio: "ignore",
    });
  }
} catch {
  // Silently fail if notification doesn't work
}
