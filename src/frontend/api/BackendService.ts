import { ipcRenderer } from 'electron';

export const backendService = {
  async trainModel(modelConfig: any) {
    return await ipcRenderer.invoke('train-model', modelConfig);
  },
  async saveModel(modelConfig: any) {
    return await ipcRenderer.invoke('save-model', modelConfig);
  },
  async loadModel(modelConfig: any) {
    return await ipcRenderer.invoke('load-model', modelConfig);
  },
};
