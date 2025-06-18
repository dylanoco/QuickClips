const { app, BrowserWindow,shell } = require("electron");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const path = require("path");

const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";




let mainWindow;
let backendProcess;

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on('update-available', () => {
  console.log("Update available");
});

autoUpdater.on('update-downloaded', () => {
  console.log("Update downloaded – will install on restart");
});
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL("http://Quickclips.uk/app");
  // mainWindow.loadURL("http://localhost:5001/app/");

  const isDev = !app.isPackaged;
  const backendPath = isDev
    ? path.join(__dirname, "backend", "dist", "QC_B", "QC_B.exe")
    : path.join(process.resourcesPath, "backend", "dist", "QC_B", "QC_B.exe");

  // backendProcess = spawn(backendPath, [], {
  //   detached: true,
  //   stdio: "ignore",
  //   windowsHide: true,
  // });

  const cmdPath = path.join(process.env['WINDIR'], 'System32', 'cmd.exe');

backendProcess = spawn(cmdPath, ["/k", backendPath], {
  detached: true,
  stdio: "inherit",
});
  backendProcess.unref();
  console.log("Spawned backend with PID:", backendProcess.pid);
});

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    // Open all new windows in default browser
    shell.openExternal(url);
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, url) => {
    const allowedHost = contents.getURL(); // allow your app's own URL
    if (url !== allowedHost) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
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

