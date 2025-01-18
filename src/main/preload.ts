import { contextBridge, ipcRenderer } from 'electron';

const pythonHandler = {
  runPython: (scriptPath: string) => ipcRenderer.invoke('run-python', scriptPath),
};

const dialogHandler = {
  onDialogUpdate: (callback: (message: string) => void) => {
    ipcRenderer.on('update-dialog', (_event, message) => callback(message));
  }
};


contextBridge.exposeInMainWorld('api', pythonHandler);
contextBridge.exposeInMainWorld('dialog', dialogHandler);

export type PythonHandler = typeof pythonHandler;
export type DialogHandler = typeof dialogHandler;