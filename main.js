// main.js
const { app, BrowserWindow ,shell} = require('electron');
const { exec } = require('child_process');
const path = require('path');
const log = require('electron-log');
const fs = require('fs');

function logCurrentDirectory() {
  const currentDirectory = process.cwd();
  log.info(`Current working directory: ${currentDirectory}`);
  
  // Optionally, write this information to a file for debugging purposes
  fs.appendFileSync(path.join(currentDirectory, 'app-log.txt'), `Current working directory: ${currentDirectory}\n`);
}


logCurrentDirectory();
function createWindow() {
  log.info('Creating window...');
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL("http://localhost:5000/");
  mainWindow.webContents.on('did-fail-load', () => {
    log.error('Failed to load content.');
  });
}

function startFlaskServer() {
  log.info('Starting Flask server...');
  log.info();
  exec('cd resources/backend && start twitchMomentsv3.exe', (error, stdout, stderr) => {
    if (error) {
      log.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      log.error(`stderr: ${stderr}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
  });
}
function killServer() {
  exec('taskkill /IM python.exe /F', (error, stdout, stderr) => {
    if (error) {
      log.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      log.error(`stderr: ${stderr}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
  });
}

app.whenReady().then(() => {
  startFlaskServer();
  createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') 
    killServer()
    app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
