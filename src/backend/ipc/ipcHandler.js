import { ipcMain } from 'electron';
import { ModelController } from '../controllers/ModelController';
import { FileManager } from '../Core/FileManager';
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');

const execAsync = promisify(exec);

/**
 * Auto-detect Python installation paths
 */
async function detectPythonPaths() {
  const possiblePaths = [];

  // Common Python installation paths based on OS
  const platform = os.platform();

  if (platform === 'win32') {
    // Windows paths
    const windowsPaths = [
      'python',
      'python3',
      'py',
      'C:\\Python39\\python.exe',
      'C:\\Python310\\python.exe',
      'C:\\Python311\\python.exe',
      'C:\\Python312\\python.exe',
      'C:\\Program Files\\Python39\\python.exe',
      'C:\\Program Files\\Python310\\python.exe',
      'C:\\Program Files\\Python311\\python.exe',
      'C:\\Program Files\\Python312\\python.exe',
      'C:\\Program Files (x86)\\Python39\\python.exe',
      'C:\\Program Files (x86)\\Python310\\python.exe',
      'C:\\Program Files (x86)\\Python311\\python.exe',
      'C:\\Program Files (x86)\\Python312\\python.exe',
      `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python39\\python.exe`,
      `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python310\\python.exe`,
      `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python311\\python.exe`,
      `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python312\\python.exe`,
    ];
    possiblePaths.push(...windowsPaths);
  } else if (platform === 'darwin') {
    // macOS paths
    const macPaths = [
      'python3',
      'python',
      '/usr/bin/python3',
      '/usr/bin/python',
      '/usr/local/bin/python3',
      '/usr/local/bin/python',
      '/opt/homebrew/bin/python3',
      '/opt/homebrew/bin/python',
      '/Library/Frameworks/Python.framework/Versions/3.9/bin/python3',
      '/Library/Frameworks/Python.framework/Versions/3.10/bin/python3',
      '/Library/Frameworks/Python.framework/Versions/3.11/bin/python3',
      '/Library/Frameworks/Python.framework/Versions/3.12/bin/python3',
      '~/.pyenv/versions/3.9.*/bin/python',
      '~/.pyenv/versions/3.10.*/bin/python',
      '~/.pyenv/versions/3.11.*/bin/python',
      '~/.pyenv/versions/3.12.*/bin/python',
    ];
    possiblePaths.push(...macPaths);
  } else {
    // Linux paths
    const linuxPaths = [
      'python3',
      'python',
      '/usr/bin/python3',
      '/usr/bin/python',
      '/usr/local/bin/python3',
      '/usr/local/bin/python',
      '/opt/python/bin/python3',
      '~/.pyenv/versions/3.9.*/bin/python',
      '~/.pyenv/versions/3.10.*/bin/python',
      '~/.pyenv/versions/3.11.*/bin/python',
      '~/.pyenv/versions/3.12.*/bin/python',
    ];
    possiblePaths.push(...linuxPaths);
  }

  // Test each path and return valid ones
  const validPaths = [];

  for (const path of possiblePaths) {
    try {
      const validation = await validatePythonPath(path);
      if (validation.isValid) {
        validPaths.push(validation.path);
      }
    } catch (error) {
      // Continue testing other paths
      continue;
    }
  }

  return validPaths;
}

/**
 * Validate a Python path and get version information
 */
async function validatePythonPath(pythonPath) {
  try {
    // Test if Python executable exists and get version
    const { stdout, stderr } = await execAsync(`"${pythonPath}" --version`, {
      timeout: 5000,
    });

    // Parse version from output
    const versionMatch =
      stdout.match(/Python (\d+\.\d+\.\d+)/) ||
      stderr.match(/Python (\d+\.\d+\.\d+)/);

    if (!versionMatch) {
      return {
        isValid: false,
        path: pythonPath,
        error: 'Could not determine Python version',
      };
    }

    const version = versionMatch[1];
    const majorVersion = parseInt(version.split('.')[0]);

    // Check if Python version is supported (3.8+)
    if (majorVersion < 3) {
      return {
        isValid: false,
        path: pythonPath,
        version,
        error: 'Python 2 is not supported. Please use Python 3.8 or higher.',
      };
    }

    const minorVersion = parseInt(version.split('.')[1]);
    if (minorVersion < 8) {
      return {
        isValid: false,
        path: pythonPath,
        version,
        warning:
          'Python version below 3.8 may have compatibility issues with some ML libraries.',
      };
    }

    // Test if we can import basic ML libraries
    try {
      await execAsync(
        `"${pythonPath}" -c "import sys; print('sys.path:', sys.path)"`,
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      return {
        isValid: false,
        path: pythonPath,
        version,
        error: 'Python executable found but failed to run basic imports',
      };
    }

    return {
      isValid: true,
      path: pythonPath,
      version,
    };
  } catch (error) {
    return {
      isValid: false,
      path: pythonPath,
      error: error.message || 'Failed to validate Python path',
    };
  }
}

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

  ipcMain.handle('analyse-folder', async (event, folderPath) => {
    const fileMngr = FileManager.getInstance();
    return await fileMngr.analyzeImageDatasetFolder(folderPath);
  });

  // Python detection handlers
  ipcMain.handle('detect-python-paths', async () => {
    try {
      return await detectPythonPaths();
    } catch (error) {
      console.error('Error detecting Python paths:', error);
      return [];
    }
  });

  ipcMain.handle('validate-python-path', async (event, pythonPath) => {
    try {
      return await validatePythonPath(pythonPath);
    } catch (error) {
      console.error('Error validating Python path:', error);
      return {
        isValid: false,
        path: pythonPath,
        error: error.message || 'Failed to validate Python path',
      };
    }
  });

  ipcMain.handle('setup-model-for-inference', async (event, filePath) => {
    const modelController = new ModelController();
    return await modelController.setupModelForInference(filePath);
  });
}
