// main.js
const { app, BrowserWindow ,shell, ipcMain} = require('electron');
const { exec } = require('child_process');
const { spawn } = require('child_process');
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
    minWidth : 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL("http://localhost:5173/");
  mainWindow.webContents.on('did-fail-load', () => {
    log.error('Failed to load content.');
  });
}
//cd resources/backend && start twitchMomentsv3.exe Deployment Line for Starting the Server
function startFlaskServer() {
  // log.info('Starting Flask server...');
  // // exec('cd backend && start twitchMomentsv3.exe', (error, stdout, stderr) => {
  // exec('cd backend && python twitchMomentsv3.py', { env: process.env },(error, stdout, stderr) => {
  //   log.info("Test Server");
  //   if (error) {
  //     log.error(`Error executing command: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     log.error(`stderr: ${stderr}`);
  //     return;
  //   }
  //   log.info(`stdout: ${stdout}`);
  // });

  const flaskProcess = spawn('python', ['twitchMomentsv3.py'], {
    cwd: 'backend',  // Set the working directory
    env: process.env
  });

  flaskProcess.stdout.on('data', (data) => {
      log.info(`stdout: ${data}`);
  });

  flaskProcess.stderr.on('data', (data) => {
      log.error(`stderr: ${data}`);
  });

  flaskProcess.on('close', (code) => {
      log.info(`Flask server exited with code ${code}`);
  });
}
function killServer() {
  log.info("Test Kill Server");
  exec('taskkill /IM twitchMomentsv3.py /F', (error, stdout, stderr) => {
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

ipcMain.on('oauth-complete', (event, userProfile) => {
  console.log('User authenticated:', userProfile);
});
