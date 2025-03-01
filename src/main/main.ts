/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import { paths } from './config';
import { installPython } from './python_setup';
import { setupIpcHandlers } from '../backend/ipc/ipcHandler';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const pythonExec = {
  win32: path.join(__dirname, 'installed-python', 'python.exe'),
  darwin: path.join(__dirname, 'installed-python', 'bin/python3'),
  linux: path.join(__dirname, 'installed-python', 'bin/python3'),
};

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  setupIpcHandlers();
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(paths.base, 'assets')
    : paths.assets;

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // fullscreen: true, // Enable full-screen mode
    // kiosk: true, // Fullscreen without creating a new desktop
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    // Install Python first
    await installPython();
    createWindow();
    app.on('activate', () => {
      // Disable browser shortcuts
      // disableBrowserShortcuts();
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// Function to disable browser shortcuts
function disableBrowserShortcuts() {
  const shortcuts = [
    'CommandOrControl+R', // Disable refresh
    'F5', // Disable F5
    'CommandOrControl+Shift+I', // Disable DevTools
    'CommandOrControl+T', // Disable new tab
    'CommandOrControl+W', // Disable tab close
    'Alt+Left', // Disable back navigation
    'Alt+Right', // Disable forward navigation
  ];

  shortcuts.forEach((shortcut) => {
    globalShortcut.register(shortcut, () => {
      console.log(`Shortcut ${shortcut} is disabled`);
    });
  });
}
let pythonProcess: ChildProcess | null = null;

ipcMain.handle(
  'run-python',
  async (
    _event: Electron.IpcMainInvokeEvent,
    scriptPath: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      pythonProcess = spawn('python3', ['-u', scriptPath]);
      let output = '';

      pythonProcess.stdout?.on('data', (data: Buffer) => {
        mainWindow?.webContents.send('update-dialog', data.toString());
      });

      pythonProcess.stderr?.on('data', (data: Buffer) => {
        mainWindow?.webContents.send('update-dialog', data.toString());
      });

      pythonProcess.on('close', (code: number) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Process exited with code ${code}\n${output}`);
        }
        // Ensure the process is terminated
        pythonProcess?.kill();
      });
    });
  },
);

ipcMain.handle('stop-python', async () => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
  }
});

ipcMain.handle('readFile', async (event, filePath) => {
  let data = await fs.promises.readFile(filePath, 'utf8');
  return data;
});

ipcMain.handle('writeFile', async (event, filePath, data) => {
  return fs.promises.writeFile(filePath, data, 'utf8');
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'CSV Files', extensions: ['csv'] },
      { name: 'Excel Files', extensions: ['xlsx', 'xls'] }
    ]
  });
  
  return result.canceled ? null : result.filePaths[0];
});
