#!/usr/bin/env node
const { execSync } = require("child_process");
const os = require("os");
const path = require("path");

const platform = os.platform();

function readStdin() {
  try {
    const fs = require("fs");
    const input = fs.readFileSync(0, "utf-8").trim();
    return input ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

function getNotificationContent(data) {
  const eventName = data.hook_event_name || "Unknown";
  const cwd = data.cwd || process.cwd();
  const projectName = path.basename(cwd);

  switch (eventName) {
    case "Stop":
      return {
        title: projectName,
        message: "Task completed",
        sound: true,
      };
    case "PermissionRequest":
      return {
        title: projectName,
        message: "Permission required",
        sound: true,
      };
    case "Notification":
      const msg = data.message || "";
      if (msg.toLowerCase().includes("waiting for")) {
        return {
          title: projectName,
          message: "Waiting for input",
          sound: true,
        };
      }
      return {
        title: projectName,
        message: msg || "Notification",
        sound: true,
      };
    default:
      return {
        title: projectName,
        message: `Claude Code: ${eventName}`,
        sound: true,
      };
  }
}

function escapeForShell(str) {
  return str.replace(/'/g, "'\\''");
}

function escapeForPowerShell(str) {
  return str.replace(/'/g, "''").replace(/`/g, "``");
}

function notifyMacOS(title, message, sound) {
  const escaped = message.replace(/"/g, '\\"');
  const escapedTitle = title.replace(/"/g, '\\"');
  const soundOption = sound ? ' sound name "default"' : "";
  const script = `display notification "${escaped}" with title "${escapedTitle}"${soundOption}`;
  execSync(`osascript -e '${script}'`, { stdio: "ignore" });
}

function notifyWindows(title, message, sound) {
  const escapedTitle = escapeForPowerShell(title);
  const escapedMessage = escapeForPowerShell(message);

  const script = `
    Add-Type -AssemblyName System.Windows.Forms
    $balloon = New-Object System.Windows.Forms.NotifyIcon
    $balloon.Icon = [System.Drawing.SystemIcons]::Information
    $balloon.BalloonTipIcon = 'Info'
    $balloon.BalloonTipTitle = '${escapedTitle}'
    $balloon.BalloonTipText = '${escapedMessage}'
    $balloon.Visible = $true
    $balloon.ShowBalloonTip(5000)
    Start-Sleep -Milliseconds 100
  `.replace(/\n/g, " ");

  execSync(`powershell -Command "${script}"`, { stdio: "ignore" });

  if (sound) {
    execSync('powershell -c "[console]::beep(800,200)"', { stdio: "ignore" });
  }
}

function notifyLinux(title, message, sound) {
  try {
    execSync(`notify-send "${title}" "${message}"`, { stdio: "ignore" });
  } catch {
    // notify-send not available, try alternative
    try {
      execSync(`zenity --notification --text="${title}: ${message}"`, { stdio: "ignore" });
    } catch {
      // Fallback to terminal bell
    }
  }

  if (sound) {
    try {
      execSync("paplay /usr/share/sounds/freedesktop/stereo/bell.oga", { stdio: "ignore" });
    } catch {
      process.stdout.write("\x07");
    }
  }
}

function notify(title, message, sound = true) {
  try {
    if (platform === "darwin") {
      notifyMacOS(title, message, sound);
    } else if (platform === "win32") {
      notifyWindows(title, message, sound);
    } else if (platform === "linux") {
      notifyLinux(title, message, sound);
    }
  } catch {
    // Silently fail if notification doesn't work
  }
}

const data = readStdin();
const { title, message, sound } = getNotificationContent(data);
notify(title, message, sound);
