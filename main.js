const { app, BrowserWindow, session, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1060,
    height: 780,
    minWidth: 960,
    minHeight: 720,
    title: 'Rigour Hero',
    autoHideMenuBar: true,
    show: false, // don't show until splash is ready
    backgroundColor: '#000000',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.setMenu(null);

  // Clear cache, then load the game with splash overlay injected via CSS
  session.defaultSession.clearCache().then(() => {
    win.loadURL('https://rigourhero.com');
  });

  // Inject splash overlay as soon as DOM is ready (before assets load)
  win.webContents.on('dom-ready', () => {
    const splashB64 = fs.readFileSync(path.join(__dirname, 'splash.jpg')).toString('base64');
    win.webContents.executeJavaScript(`(function() {
        if (document.getElementById('electron-splash')) return;
        var s = document.createElement('div');
        s.id = 'electron-splash';
        s.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;transition:opacity 0.5s;';
        s.innerHTML = '<div style="text-align:center;">' +
          '<img src="data:image/jpeg;base64,${splashB64}" style="max-width:340px;width:80vw;margin-bottom:24px;">' +
          '<div style="width:200px;margin:0 auto;height:6px;background:#111;border:1px solid #ffcc004d;overflow:hidden;">' +
          '<div id="splash-bar" style="height:100%;width:5%;background:linear-gradient(90deg,#aa8800,#ffcc00);transition:width 0.4s;"></div>' +
          '</div>' +
          '<div style="color:#555;font-family:Courier New,monospace;font-size:11px;margin-top:8px;" id="splash-status">Loading...</div>' +
          '</div>';
        document.body.appendChild(s);

        // Progress: poll canvas for actual rendered content
        var bar = document.getElementById('splash-bar');
        var status = document.getElementById('splash-status');
        var ticks = 0;
        var iv = setInterval(function() {
          ticks++;
          var pct = Math.min(5 + ticks * 3, 90);
          bar.style.width = pct + '%';

          // Check if canvas has rendered anything
          var c = document.getElementById('game');
          if (c) {
            try {
              var px = c.getContext('2d').getImageData(240, 360, 1, 1).data;
              if (px[3] > 0) {
                // Canvas has content — game is loaded
                bar.style.width = '100%';
                status.textContent = 'Ready!';
                clearInterval(iv);
                setTimeout(function() {
                  s.style.opacity = '0';
                  setTimeout(function() { s.remove(); }, 500);
                }, 300);
              }
            } catch(e) {}
          }
          // Timeout after 15s
          if (ticks > 150) {
            clearInterval(iv);
            s.style.opacity = '0';
            setTimeout(function() { s.remove(); }, 500);
          }
        }, 100);
      })();
    `).then(() => win.show()).catch(() => win.show());
  });

  // User agent
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = details.requestHeaders['User-Agent'] + ' RigourHeroDesktop/1.0';
    callback({ requestHeaders: details.requestHeaders });
  });
}

app.whenReady().then(() => {
  createWindow();
  // Auto-update
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates().catch(() => {});
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version of Rigour Hero is available!',
      buttons: ['Update Now', 'Later'],
      defaultId: 0,
    }).then(result => {
      if (result.response === 0) autoUpdater.downloadUpdate();
    });
  });
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. Rigour Hero will restart to apply it.',
      buttons: ['Restart Now'],
    }).then(() => autoUpdater.quitAndInstall());
  });
});

app.on('window-all-closed', () => app.quit());
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
