const { app, BrowserWindow ,shell} = require('electron');
const path = require('path');
const log = require('electron-log');
function createWindow() {
  console.log("Test Dirname:" ,__dirname);
  log.info("Test Dirname:" ,__dirname);
  const mainWindow = new BrowserWindow({
    minWidth: 1280,
    minHeight: 720,
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  

  // Load the React app or an HTML file
  mainWindow.loadURL('http://localhost:5173'); // Replace with your React app's URL
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
