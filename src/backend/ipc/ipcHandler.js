import { ipcMain } from 'electron';
import { ModelController } from '../controllers/ModelController';

export function setupIpcHandlers() {
  ipcMain.handle('train-model', async (event, modelGraph) => {
    const modelController = new ModelController();
    return await modelController.trainModel(modelGraph);
  });
}
