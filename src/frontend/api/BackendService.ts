import { ipcRenderer } from 'electron';

export const backendService = {
  async trainModel(modelConfig: any) {
    return await ipcRenderer.invoke('train-model', modelConfig);
  },
};
