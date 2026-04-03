const { app, BrowserWindow, session } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1060,
    height: 780,
    minWidth: 960,
    minHeight: 720,
    title: 'Rigour Hero',
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    icon: __dirname + '/icon.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Clear ALL cache on every launch — no stale content ever
  session.defaultSession.clearCache().then(() => {
    win.loadURL('https://rigourhero.com');
  });

  // Set user agent to indicate desktop client
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'] + ' RigourHeroDesktop/1.0';
    callback({ requestHeaders: details.requestHeaders });
  });

  // Remove menu bar
  win.setMenu(null);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
