// main.js
const { app, BrowserWindow ,shell} = require('electron');
const path = require('path');
const log = require('electron-log');

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

  mainWindow.loadFile(path.join(__dirname, '/react-project/dist/index.html'));
  mainWindow.webContents.on('did-fail-load', () => {
    log.error('Failed to load content.');
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
