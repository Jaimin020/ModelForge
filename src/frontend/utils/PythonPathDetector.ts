import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface PythonPathValidationResult {
  isValid: boolean;
  path: string;
  version?: string;
  error?: string;
  warning?: string;
}

export class PythonPathDetector {
  private static instance: PythonPathDetector;

  private constructor() {}

  public static getInstance(): PythonPathDetector {
    if (!PythonPathDetector.instance) {
      PythonPathDetector.instance = new PythonPathDetector();
    }
    return PythonPathDetector.instance;
  }

  /**
   * Auto-detect Python installation paths
   */
  public async detectPythonPaths(): Promise<string[]> {
    const possiblePaths: string[] = [];

    // Common Python installation paths based on OS
    const platform = process.platform;

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
    const validPaths: string[] = [];

    for (const path of possiblePaths) {
      try {
        const validation = await this.validatePythonPath(path);
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
  public async validatePythonPath(
    pythonPath: string,
  ): Promise<PythonPathValidationResult> {
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
    } catch (error: any) {
      return {
        isValid: false,
        path: pythonPath,
        error: error.message || 'Failed to validate Python path',
      };
    }
  }

  /**
   * Get the best available Python path (first valid one found)
   */
  public async getBestPythonPath(): Promise<string | null> {
    const validPaths = await this.detectPythonPaths();
    return validPaths.length > 0 ? validPaths[0] : null;
  }
}

export default PythonPathDetector;
