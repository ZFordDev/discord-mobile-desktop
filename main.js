const { app, BrowserWindow, dialog, shell, session, desktopCapturer } = require('electron');
const https = require('https');
const path = require('path');

const DISCORD_HOSTS = new Set(['discord.com', 'discordapp.com']);
let mainWindow;

function isDiscordUrl(value) {
  try {
    const hostname = new URL(value).hostname;
    return DISCORD_HOSTS.has(hostname) || hostname.endsWith('.discord.com') || hostname.endsWith('.discordapp.com');
  } catch {
    return false;
  }
}

function handlePermissionRequest(webContents, permission, callback) {
  const requestingUrl = webContents?.getURL() || '';
  callback(isDiscordUrl(requestingUrl) && [
    'media',
    'notifications',
    'fullscreen',
    'clipboard-read',
    'clipboard-sanitized-write',
    'display-capture'
  ].includes(permission));
}

function handlePermissionCheck(webContents, permission, requestingOrigin) {
  const requestingUrl = webContents?.getURL() || requestingOrigin;
  return isDiscordUrl(requestingUrl) && [
    'media',
    'notifications',
    'fullscreen',
    'clipboard-read',
    'clipboard-sanitized-write',
    'display-capture'
  ].includes(permission);
}

async function selectDisplaySource(request) {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 240, height: 135 },
    fetchWindowIcons: true
  });

  if (!sources.length) return null;

  const labels = sources.map((source) => `${source.type === 'screen' ? 'Screen' : 'Window'}: ${source.name}`);
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    title: 'Choose what to share',
    message: request.audioRequested ? 'Select a screen or window for Discord to share.' : 'Select a screen or window.',
    buttons: [...labels, 'Cancel'],
    cancelId: labels.length,
    defaultId: 0,
    noLink: true
  });

  return result.response < sources.length ? sources[result.response] : null;
}

function configureSession() {
  const discordSession = session.defaultSession;
  discordSession.setPermissionRequestHandler(handlePermissionRequest);
  discordSession.setPermissionCheckHandler(handlePermissionCheck);

  discordSession.setDisplayMediaRequestHandler(async (request, callback) => {
    if (!isDiscordUrl(request.securityOrigin) || !mainWindow || mainWindow.isDestroyed()) {
      callback(null);
      return;
    }

    try {
      const source = await selectDisplaySource(request);
      callback(source ? {
        video: source,
        ...(request.audioRequested && process.platform === 'win32' ? { audio: 'loopback' } : {})
      } : null);
    } catch {
      callback(null);
    }
  });

  discordSession.on('will-download', (event, item) => {
    item.setSavePath(path.join(app.getPath('downloads'), item.getFilename()));
    item.once('done', (downloadEvent, state) => {
      if (state === 'completed') shell.showItemInFolder(item.getSavePath());
    });
  });
}

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
  mainWindow = new BrowserWindow({
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
  mainWindow.webContents.setUserAgent(mobileUA);

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isDiscordUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isDiscordUrl(url)) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('render-process-gone', () => {
    if (!mainWindow.isDestroyed()) mainWindow.loadURL('https://discord.com/login');
  });
  
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.insertCSS(`
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

  mainWindow.loadURL('https://discord.com/login');
}

// Initialize lifecycle hooks
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    configureSession();
    checkForUpdates();
    createWindow();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});