import { ipcRenderer } from 'electron';

export const backendService = {
  async trainModel(modelConfig: any) {
    return await ipcRenderer.invoke('train-model', modelConfig);
  },
  async saveModel(modelConfig: any, modelPath: string) {
    return await ipcRenderer.invoke('save-model', modelConfig, modelPath);
  },
  async loadModel(modelPath: string) {
    return await ipcRenderer.invoke('load-model', modelPath);
  },
};
