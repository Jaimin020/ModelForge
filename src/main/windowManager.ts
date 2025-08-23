import { BrowserWindow, app } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';

export function createNewWindow(options = {}) {
  const newWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // fullscreen: true, // Enable full-screen mode
    // kiosk: true, // Fullscreen without creating a new desktop
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  newWindow.loadURL(resolveHtmlPath('train.html'));

  newWindow.on('ready-to-show', () => {
    if (!newWindow) {
      throw new Error('"newWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      newWindow.minimize();
    } else {
      newWindow.show();
    }
  });

  newWindow.on('closed', () => {
    // Clean up references if needed
  });
  return newWindow;
}
