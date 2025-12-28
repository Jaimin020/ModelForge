import { ipcRenderer } from 'electron';

export const backendService = {
  async trainModel(modelGraph: any) {
    return await ipcRenderer.invoke('train-model', modelGraph);
  },
  async saveModel(modelGraph: any, modelPath: string) {
    return await ipcRenderer.invoke('save-model', modelGraph, modelPath);
  },
  async loadModel(modelPath: string) {
    return await ipcRenderer.invoke('load-model', modelPath);
  },
  async analyseFolder(folderPath: string) {
    return await ipcRenderer.invoke('analyse-folder', folderPath);
  },
  async setupModelForInference(filePath: string) {
    return await ipcRenderer.invoke('setup-model-for-inference', filePath);
  },
};
