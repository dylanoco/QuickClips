const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
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

  mainWindow.loadURL("http://Quickclips.uk"); // Change this if needed

  // Start Python backend
  backendPath = path.join(process.resourcesPath, "backend", "dist", "twitchmomentsv3.exe");

  backendProcess = spawn(backendPath, [], { stdio: ["inherit", "pipe", "pipe"] });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend Output: ${data.toString()}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data.toString()}`);
  });
  
  backendProcess.on("close", (code) => {
    console.log(`Backend exited with code ${code}`);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    backendProcess.kill();
  });
});
