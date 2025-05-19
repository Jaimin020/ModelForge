import { contextBridge, ipcRenderer } from 'electron';
import { backendService } from '../frontend/api/BackendService';

const pythonHandler = {
  runPython: (scriptPath: string) =>
    ipcRenderer.invoke('run-python', scriptPath),
  stopPython: () => ipcRenderer.invoke('stop-python'),
};

const dialogHandler = {
  onDialogUpdate: (callback: (message: string) => void) => {
    // Remove any existing listeners before adding new one
    ipcRenderer.removeAllListeners('update-dialog');
    ipcRenderer.on('update-dialog', (_event, message) => {
      callback(message);
    });
  },
  filePicker: (fileFormate: string) =>
    ipcRenderer.invoke('select-file', fileFormate),

  saveFilePathPicker: (defaultName: string, extensions: string[]) =>
    ipcRenderer.invoke('save-file-dialog', { defaultName, extensions }),
};

const fileHandler = {
  readFile: (filePath: string) => ipcRenderer.invoke('readFile', filePath),
  writeFile: (filePath: string, data: string) =>
    ipcRenderer.invoke('writeFile', filePath, data),
  readCsvOrExelFile: (filePath: string) =>
    ipcRenderer.invoke('readCsvOrExelFile', filePath),
};

const windowHandler = {
  openNewWindow: (options: any) =>
    ipcRenderer.invoke('create-new-window', options),
};

contextBridge.exposeInMainWorld('api', pythonHandler);
contextBridge.exposeInMainWorld('dialog', dialogHandler);
contextBridge.exposeInMainWorld('file', fileHandler);
contextBridge.exposeInMainWorld('backend', backendService);
contextBridge.exposeInMainWorld('windowMngr', windowHandler);

export type PythonHandler = typeof pythonHandler;
export type DialogHandler = typeof dialogHandler;
export type FileHandler = typeof fileHandler;
