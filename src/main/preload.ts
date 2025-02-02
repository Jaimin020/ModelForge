import { contextBridge, ipcRenderer } from 'electron';

const pythonHandler = {
  runPython: (scriptPath: string) => ipcRenderer.invoke('run-python', scriptPath),
  stopPython: () => ipcRenderer.invoke('stop-python')
};

const dialogHandler = {
  onDialogUpdate: (callback: (message: string) => void) => {
    // Remove any existing listeners before adding new one
    ipcRenderer.removeAllListeners('update-dialog');
    ipcRenderer.on('update-dialog', (_event, message) => {callback(message)});
  }
};

const fileHandler = {
  readFile: (filePath: string) => ipcRenderer.invoke('readFile', filePath),
  writeFile: (filePath: string, data: string) => ipcRenderer.invoke('writeFile', filePath, data)
};


contextBridge.exposeInMainWorld('api', pythonHandler);
contextBridge.exposeInMainWorld('dialog', dialogHandler);
contextBridge.exposeInMainWorld('file', fileHandler);

export type PythonHandler = typeof pythonHandler;
export type DialogHandler = typeof dialogHandler;
export type FileHandler = typeof fileHandler;