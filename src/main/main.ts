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
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import { paths } from './config';
import { setupIpcHandlers } from '../backend/ipc/ipcHandler';
import * as XLSX from 'xlsx';
import { createNewWindow } from './windowManager';
import PythonStartupSetup from './PythonStartupSetup';
import { selectFilePath, selectSaveFilePath } from './dialogHandlers';

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

type StartupUiState = {
  isVisible: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  message: string;
  logs: string[];
  appName: string;
  version: string;
  error?: string;
};

let mainWindow: BrowserWindow | null = null;
const resolvedAppVersion = resolveAppVersion();
let startupState: StartupUiState = {
  isVisible: true,
  status: 'idle',
  message: 'Preparing Python environment...',
  logs: [],
  appName: app.getName(),
  version: resolvedAppVersion,
};

function updateStartupState(partial: Partial<StartupUiState>) {
  startupState = {
    ...startupState,
    ...partial,
  };

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('startup-state-updated', startupState);
  }
}

function appendStartupLog(message: string) {
  const nextLogs = [...startupState.logs, message].slice(-200);
  updateStartupState({
    logs: nextLogs,
    message,
  });
}

function resolveAppVersion(): string {
  const appVersion = app.getVersion();
  if (appVersion && appVersion !== '0.0' && appVersion !== '0.0.0') {
    return appVersion;
  }

  const candidatePaths = [
    path.join(app.getAppPath(), 'package.json'),
    path.join(process.cwd(), 'release/app/package.json'),
    path.join(process.cwd(), 'package.json'),
  ];

  for (const candidatePath of candidatePaths) {
    try {
      if (!fs.existsSync(candidatePath)) {
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
      if (
        packageJson.version &&
        packageJson.version !== '0.0' &&
        packageJson.version !== '0.0.0'
      ) {
        return packageJson.version;
      }
    } catch (error) {
      continue;
    }
  }

  return appVersion || '0.0.0';
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('get-startup-state', async () => startupState);
ipcMain.handle('dismiss-startup-error', async () => {
  const startupSetup = PythonStartupSetup.getInstance();
  await startupSetup.cleanupFailedVenvOnDemand();
  updateStartupState({
    isVisible: false,
  });
  return true;
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
    await createWindow();

    try {
      const startupSetup = PythonStartupSetup.getInstance();
      startupSetup.setLogger(appendStartupLog);
      updateStartupState({
        isVisible: true,
        status: 'running',
        message: 'Preparing Python environment...',
        logs: ['Starting ModelForge setup.'],
        appName: app.getName(),
        version: resolvedAppVersion,
        error: undefined,
      });
      await startupSetup.runStartupSetup();
      updateStartupState({
        isVisible: false,
        status: 'success',
        message: 'Startup setup completed.',
      });
    } catch (error: any) {
      log.error('Python startup setup failed:', error);
      appendStartupLog(
        error?.message ||
          'ModelForge could not prepare the Python environment on startup.',
      );
      updateStartupState({
        isVisible: true,
        status: 'error',
        error:
        error?.message ||
          'ModelForge could not prepare the Python environment on startup.',
        message: 'Python setup failed.',
      });
    }

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

async function formatPythonFile(scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const formatProcess = spawn('python3', ['-m', 'black', scriptPath]);

    formatProcess.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Formatting failed with code ${code}`);
      }
    });
  });
}

ipcMain.handle(
  'run-python',
  async (
    _event: Electron.IpcMainInvokeEvent,
    scriptPath: string,
  ): Promise<string> => {
    // Format the file first
    // await formatPythonFile(scriptPath);

    return new Promise((resolve, reject) => {
      pythonProcess = spawn(paths.venvPython, ['-u', scriptPath]);
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
          resolve(`Process exited with code ${code}\n${output}`);
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
  return fs.promises.writeFile(filePath, data);
});

ipcMain.handle('select-file', async (event, fileFomrate, isFolderType) => {
  return selectFilePath(mainWindow, fileFomrate, isFolderType);
});

ipcMain.handle(
  'save-file-dialog',
  async (_event, { defaultName, extensions }) => {
    return selectSaveFilePath({
      defaultName,
      extensions,
    });
  },
);

ipcMain.handle('readCsvOrExelFile', async (event, filePath) => {
  try {
    // Read file as binary buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Parse Excel file from buffer
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

    const rowCount = data.length;
    const columnCount = data[0]?.length || 0;
    let columnNames: string[] = [];
    let hasHeaders = false;

    if (rowCount > 0) {
      const firstRow = data[0];
      hasHeaders = firstRow.every((cell) => typeof cell === 'string');
      columnNames = hasHeaders
        ? (firstRow as string[])
        : Array.from({ length: columnCount }, (_, i) => `column_${i + 1}`);
    }

    return {
      data: XLSX.utils.sheet_to_json(firstSheet),
      stats: {
        rowCount: hasHeaders ? rowCount - 1 : rowCount,
        columnCount,
        columnNames,
        hasHeaders,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
});

ipcMain.handle('create-new-window', (event, windowOptions = {}) => {
  const newWindow = createNewWindow(windowOptions);
  return newWindow.id; // Return the window ID for reference
});
