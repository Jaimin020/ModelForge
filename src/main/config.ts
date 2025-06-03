import path from 'path';
import os from 'os';
import dotenv from 'dotenv';

dotenv.config();

// Check if running in packaged app
const isPackaged = process.env.NODE_ENV === 'production' && !process.env.ELECTRON_IS_DEV;

const basePath = process.env.BASE_PATH || path.resolve(__dirname, '..');

// Define Python executable paths for different platforms
const pythonExecPaths = {
  win32: 'python.exe',
  darwin: 'bin/python3',
  linux: 'bin/python3',
};

const platform = os.platform() as keyof typeof pythonExecPaths;

// Determine the correct Python path based on packaging state
const getVenvPythonPath = (): string => {
  // If explicitly set in environment, use that (with BASE_PATH replacement)
  if (process.env.VENV_PYTHON_PATH) {
    return process.env.VENV_PYTHON_PATH.replace('${BASE_PATH}', basePath);
  }

  // For packaged app, use resources path
  if (isPackaged) {
    // In packaged app, we need to use process.resourcesPath
    // This will be set properly when electron app is running
    const resourcesPath = (global as any).process?.resourcesPath || basePath;
    return path.join(resourcesPath, 'installed-python', pythonExecPaths[platform]);
  }

  // For development, use the installed-python in main directory
  return path.join(__dirname, 'installed-python', pythonExecPaths[platform]);
};

export const paths = {
  base: basePath,
  assets: process.env.ASSETS_PATH || path.join(basePath, 'assets'),
  venvPython: getVenvPythonPath(),
};

// Export a function to update venvPython path after app is ready (for packaged apps)
export const updateVenvPythonPath = (resourcesPath: string) => {
  if (isPackaged) {
    (paths as any).venvPython = path.join(resourcesPath, 'installed-python', pythonExecPaths[platform]);
  }
};
