import { contextBridge, ipcRenderer } from 'electron';

const pythonHandler = {
  runPython: (scriptPath: string) => ipcRenderer.invoke('run-python', scriptPath),
};

contextBridge.exposeInMainWorld('api', pythonHandler);

export type PythonHandler = typeof pythonHandler;
