import { ipcMain } from 'electron';
import { ModelController } from '../controllers/ModelController';

export function setupIpcHandlers() {
  ipcMain.handle('train-model', async (event, modelGraph) => {
    const modelController = new ModelController();
    return await modelController.trainModel(modelGraph);
  });

  ipcMain.handle('save-model', async (event, modelGraph, filePath) => {
    const modelController = new ModelController();
    return await modelController.saveModel(modelGraph, filePath);
  });

  ipcMain.handle('load-model', async (event, modelPath) => {
    const modelController = new ModelController();
    return await modelController.loadModel(modelPath);
  });
}
