const { app, BrowserWindow, dialog, shell } = require('electron');
const https = require('https');
const path = require('path');

// Dynamically read package.json metadata
const packageJson = require(path.join(__dirname, 'package.json'));

async function checkForUpdates() {
  // Graceful fallback if repository field is missing or incorrectly formatted
  if (!packageJson.repository) return;
  
  // Extract "owner/repo" from standard repository URLs or strings
  const repoUrl = typeof packageJson.repository === 'object' ? packageJson.repository.url : packageJson.repository;
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/.]+)/);
  if (!match) return;
  
  const repoPath = match[1].replace('.git', '');

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${repoPath}/releases/latest`,
    headers: { 'User-Agent': 'Electron-Update-Check' }
  };

  https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const release = JSON.parse(data);
        const latestVersion = release.tag_name;
        const currentVersion = `${packageJson.version || app.getVersion()}`;

        if (latestVersion && latestVersion !== currentVersion) {
          dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: `A new version (${latestVersion}) is available. It is highly recommended to update to keep Electron secure.`,
            buttons: ['Download', 'Later']
          }).then((result) => {
            if (result.response === 0 && release.html_url) {
              shell.openExternal(release.html_url);
            }
          });
        }
      } catch (e) {
        // Silent catch to prevent errors if API fails or user is offline
      }
    });
  }).on('error', () => {});
}

function createWindow () {
  const win = new BrowserWindow({
    width: 390,
    height: 844,
    minWidth: 360,
    maxWidth: 480,
    autoHideMenuBar: true,
    titleBarStyle: 'default', 

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const mobileUA = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36";
  win.webContents.setUserAgent(mobileUA);
  
  win.webContents.on('dom-ready', () => {
    win.webContents.insertCSS(`
      body::-webkit-scrollbar,
      html::-webkit-scrollbar,
      div::-webkit-scrollbar {
        display: none !important;
      }
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
    `);
  });

  win.loadURL('https://discord.com/login');
}

// Initialize lifecycle hooks
app.whenReady().then(() => {
  checkForUpdates();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});