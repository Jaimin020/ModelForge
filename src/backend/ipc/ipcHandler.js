import { ipcMain } from 'electron';
import { ModelController } from '../controllers/ModelController';
import { FileManager } from '../Core/FileManager';
import PythonStartupSetup from '../../main/PythonStartupSetup';

export function setupIpcHandlers() {
  const pythonSetup = PythonStartupSetup.getInstance();

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

  ipcMain.handle('analyse-folder', async (event, folderPath) => {
    const fileMngr = FileManager.getInstance();
    return await fileMngr.analyzeImageDatasetFolder(folderPath);
  });

  // Python detection handlers
  ipcMain.handle('detect-python-paths', async () => {
    try {
      return await pythonSetup.detectPythonPaths();
    } catch (error) {
      console.error('Error detecting Python paths:', error);
      return [];
    }
  });

  ipcMain.handle('validate-python-path', async (event, pythonPath) => {
    try {
      return await pythonSetup.validatePythonPath(pythonPath);
    } catch (error) {
      console.error('Error validating Python path:', error);
      return {
        isValid: false,
        path: pythonPath,
        error: error.message || 'Failed to validate Python path',
      };
    }
  });
}
