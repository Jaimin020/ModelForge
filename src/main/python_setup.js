import { paths } from './config';
import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import sudo from 'sudo-prompt';

const baseDir = paths.base;
const pythonInstallPath = path.join(baseDir, 'src/main/installed-python');
const installersPath = path.join(baseDir, 'src/main/python_installer');
const platform = os.platform();

// Define installers per OS
const installers = {
  win32: path.join(installersPath, 'python-win.exe'),
  darwin: path.join(installersPath, 'python-mac.pkg'),
  linux: path.join(installersPath, 'python-linux.sh'),
};

const pythonExec = {
  win32: path.join(pythonInstallPath, 'python.exe'),
  darwin: path.join(pythonInstallPath, 'bin/python3'),
  linux: path.join(pythonInstallPath, 'bin/python3'),
};

// Add this function to handle privileged installation
function executeWithPrivileges(command) {
  return new Promise((resolve, reject) => {
    const options = {
      name: 'Python Installer',
    };

    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

export function installPython() {
  //   return new Promise((resolve, reject) => {
  //     if (platform === "win32") {
  //         const installCommand = `"${installers[platform]}" /quiet InstallAllUsers=1 TargetDir="${pythonInstallPath}"`;
  //         exec(installCommand, (error) => {
  //             if (error) reject(error);
  //             else resolve();
  //         });
  //     } else {
  //         /**
  //          * Constructs a set of setup commands to install Python based on the current platform.
  //          * The commands include creating the installation directory and running the appropriate
  //          * installer script for the platform.
  //          */
  //         const setupCommands = [
  //             `mkdir -p "${pythonInstallPath}"`,
  //             platform === "darwin"
  //                 ? `sudo installer -pkg "${installers[platform]}" -target ${pythonInstallPath}`
  //                 : `bash "${installers[platform]}" --prefix "${pythonInstallPath}"`
  //         ].join(' && ');
  //         executeWithPrivileges(setupCommands)
  //             .then(resolve)
  //             .catch(reject);
  //     }
  // });
}
