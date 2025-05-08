const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;
let backendProcess;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.loadURL("http://Quickclips.uk/app");
  mainWindow.loadURL("http://localhost:5001/app/");

  const isDev = !app.isPackaged;
  const backendPath = isDev
    ? path.join(__dirname, "backend", "dist", "twitchmomentsv3.exe")
    : path.join(process.resourcesPath, "backend", "dist", "twitchmomentsv3.exe");

  backendProcess = spawn(backendPath, [], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  backendProcess.unref();

  console.log("Spawned backend with PID:", backendProcess.pid);
});

// Before quit
app.on('before-quit', async () => {
  if (backendProcess && backendProcess.pid) {
    try {
      const taskkillPath = path.join(process.env['WINDIR'], 'System32', 'taskkill.exe');
      const cmd = `"${taskkillPath}" /pid ${backendProcess.pid} /T /F`;
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error("Failed to kill backend process tree:", err);
        } else {
          console.log("Successfully killed backend process tree.");
        }
      });
    } catch (error) {
      console.error("Failed to shutdown backend:", error);
    }
  }
});

