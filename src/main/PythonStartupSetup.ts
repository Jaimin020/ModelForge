import { app } from 'electron';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { paths } from './config';
import { generateEnvPathFile } from './envPathGenerator';

const execFileAsync = promisify(execFile);

export interface PythonPathValidationResult {
  isValid: boolean;
  path: string;
  version?: string;
  error?: string;
  warning?: string;
}

export interface StartupSetupResult {
  pythonPath: string;
  venvPath: string;
  venvPythonPath: string;
  requirementsPath: string;
  installedPackages: string[];
}

type StartupLogger = (message: string) => void;

type RequirementSpec = {
  raw: string;
  packageName: string;
};

export class PythonStartupSetup {
  private static instance: PythonStartupSetup;

  private readonly venvName = '__MF_PYTROCH__';

  private logger?: StartupLogger;
  private failedVenvPath: string | null = null;

  private constructor() {}

  public static getInstance(): PythonStartupSetup {
    if (!PythonStartupSetup.instance) {
      PythonStartupSetup.instance = new PythonStartupSetup();
    }

    return PythonStartupSetup.instance;
  }

  public async runStartupSetup(): Promise<StartupSetupResult> {
    const venvPath = path.join(this.venvRoot, this.venvName);

    this.failedVenvPath = null;

    try {
      this.log('Checking Python requirements file.');
      const requirementsPath = await this.ensureRequirementsFile();

      this.log('Detecting Python installation.');
      const pythonPath = await this.resolvePythonPath();
      this.log(`Using Python: ${pythonPath}`);

      this.log('Checking venv module support.');
      await this.ensureVenvModule(pythonPath);

      this.log(`Checking virtual environment: ${venvPath}`);
      await this.ensureVirtualEnvironment(pythonPath, venvPath);

      const venvPythonPath = this.getVenvPythonPath(venvPath);
      this.log('Checking pip inside the virtual environment.');
      await this.ensurePipAvailable(venvPythonPath);

      const requirements = await this.readRequirements();
      this.log(`Validating ${requirements.length} required Python packages.`);
      const missingPackages = await this.findMissingPackages(
        venvPythonPath,
        requirements,
      );

      if (missingPackages.length > 0) {
        this.log(
          `Installing missing packages: ${missingPackages
            .map((item) => item.packageName)
            .join(', ')}.`,
        );
        await this.installMissingPackages(venvPythonPath, missingPackages);
      } else {
        this.log('All required Python packages are already installed.');
      }

      this.log('Configuring environment variables.');
      this.configureEnvironment({
        pythonPath,
        venvPath,
        venvPythonPath,
      });

      this.log('Updating envPath.js with startup environment values.');
      await this.executeEnvSetupScript();

      this.log('Python startup setup completed.');
      this.failedVenvPath = null;

      return {
        pythonPath,
        venvPath,
        venvPythonPath,
        requirementsPath,
        installedPackages: requirements.map((item) => item.packageName),
      };
    } catch (error) {
      this.failedVenvPath = venvPath;
      throw error;
    }
  }

  public async cleanupFailedVenvOnDemand(): Promise<void> {
    if (!this.failedVenvPath) {
      return;
    }

    const venvPath = this.failedVenvPath;
    this.failedVenvPath = null;
    await this.removeVenvDirectory(venvPath);
  }

  public setLogger(logger?: StartupLogger): void {
    this.logger = logger;
  }

  public async detectPythonPaths(): Promise<string[]> {
    const possiblePaths = new Set<string>();
    const platform = os.platform();

    if (process.env.PYTHON_PATH) {
      possiblePaths.add(process.env.PYTHON_PATH);
    }

    if (platform === 'win32') {
      [
        'py',
        'python',
        'python3',
        'C:\\Python39\\python.exe',
        'C:\\Python310\\python.exe',
        'C:\\Python311\\python.exe',
        'C:\\Python312\\python.exe',
        `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python311\\python.exe`,
        `${process.env.LOCALAPPDATA}\\Programs\\Python\\Python312\\python.exe`,
      ].forEach((candidate) => possiblePaths.add(candidate));
    } else if (platform === 'darwin') {
      [
        'python3',
        'python',
        '/usr/bin/python3',
        '/usr/local/bin/python3',
        '/opt/homebrew/bin/python3',
      ].forEach((candidate) => possiblePaths.add(candidate));
    } else {
      [
        'python3',
        'python',
        '/usr/bin/python3',
        '/usr/local/bin/python3',
        '/opt/python/bin/python3',
      ].forEach((candidate) => possiblePaths.add(candidate));
    }

    const validPaths: string[] = [];

    for (const candidate of possiblePaths) {
      const validation = await this.validatePythonPath(candidate);
      if (validation.isValid) {
        validPaths.push(validation.path);
      }
    }

    return [...new Set(validPaths)];
  }

  public async validatePythonPath(
    pythonPath: string,
  ): Promise<PythonPathValidationResult> {
    try {
      const { stdout, stderr } = await execFileAsync(pythonPath, ['--version'], {
        timeout: 5000,
      });
      const versionOutput = `${stdout}${stderr}`;
      const versionMatch = versionOutput.match(/Python (\d+\.\d+\.\d+)/);

      if (!versionMatch) {
        return {
          isValid: false,
          path: pythonPath,
          error: 'Could not determine Python version.',
        };
      }

      const version = versionMatch[1];
      const [major, minor] = version.split('.').map(Number);

      if (major < 3 || (major === 3 && minor < 8)) {
        return {
          isValid: false,
          path: pythonPath,
          version,
          error: 'Python 3.8 or newer is required.',
        };
      }

      await execFileAsync(
        pythonPath,
        ['-c', 'import sys, venv; print(sys.executable)'],
        { timeout: 5000 },
      );

      return {
        isValid: true,
        path: pythonPath,
        version,
      };
    } catch (error: any) {
      return {
        isValid: false,
        path: pythonPath,
        error: error.message || 'Failed to validate Python path.',
      };
    }
  }

  private async resolvePythonPath(): Promise<string> {
    const detectedPaths = await this.detectPythonPaths();
    if (detectedPaths.length === 0) {
      throw new Error(
        'No supported Python installation found. Install Python 3.8+ before starting ModelForge.',
      );
    }

    return detectedPaths[0];
  }

  private async ensureVenvModule(pythonPath: string): Promise<void> {
    try {
      await execFileAsync(pythonPath, ['-m', 'venv', '--help'], {
        timeout: 10000,
      });
    } catch (error) {
      throw new Error(
        `Python at "${pythonPath}" does not provide the "venv" module.`,
      );
    }
  }

  private async ensureVirtualEnvironment(
    pythonPath: string,
    venvPath: string,
  ): Promise<void> {
    const venvPythonPath = this.getVenvPythonPath(venvPath);
    if (fs.existsSync(venvPythonPath)) {
      return;
    }

    await fs.promises.mkdir(this.venvRoot, { recursive: true });
    await execFileAsync(pythonPath, ['-m', 'venv', venvPath], {
      timeout: 120000,
    });
  }

  private async ensurePipAvailable(venvPythonPath: string): Promise<void> {
    try {
      await execFileAsync(venvPythonPath, ['-m', 'pip', '--version'], {
        timeout: 10000,
      });
    } catch (error) {
      await execFileAsync(venvPythonPath, ['-m', 'ensurepip', '--upgrade'], {
        timeout: 120000,
      });
    }
  }

  private async findMissingPackages(
    venvPythonPath: string,
    requirements: RequirementSpec[],
  ): Promise<RequirementSpec[]> {
    const missing: RequirementSpec[] = [];

    for (const requirement of requirements) {
      try {
        await execFileAsync(
          venvPythonPath,
          ['-m', 'pip', 'show', requirement.packageName],
          {
            timeout: 10000,
          },
        );
      } catch (error) {
        missing.push(requirement);
      }
    }

    return missing;
  }

  private async installMissingPackages(
    venvPythonPath: string,
    missingPackages: RequirementSpec[],
  ): Promise<void> {
    await execFileAsync(
      venvPythonPath,
      ['-m', 'pip', 'install', '--upgrade', 'pip', 'setuptools', 'wheel'],
      {
        timeout: 300000,
      },
    );

    await execFileAsync(
      venvPythonPath,
      ['-m', 'pip', 'install', ...missingPackages.map((item) => item.raw)],
      {
        timeout: 900000,
      },
    );
  }

  private async readRequirements(): Promise<RequirementSpec[]> {
    const content = await fs.promises.readFile(
      this.getRequirementsPath(),
      'utf8',
    );

    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => ({
        raw: line,
        packageName: line.split(/[<>=!~\[]/, 1)[0].trim(),
      }))
      .filter((item) => item.packageName.length > 0);
  }

  private async ensureRequirementsFile(): Promise<string> {
    const requirementsPath = this.getRequirementsPath();

    if (fs.existsSync(requirementsPath)) {
      return requirementsPath;
    }

    const defaultRequirements = [
      'torch',
      'torchvision',
      'torchaudio',
      'numpy',
      'pandas',
      'scikit-learn',
      'pillow',
      'opencv-python',
      'scikit-image',
      'matplotlib',
      'black',
    ].join('\n');

    await fs.promises.mkdir(path.dirname(requirementsPath), { recursive: true });
    await fs.promises.writeFile(
      requirementsPath,
      `${defaultRequirements}\n`,
      'utf8',
    );
    return requirementsPath;
  }

  private configureEnvironment({
    pythonPath,
    venvPath,
    venvPythonPath,
  }: {
    pythonPath: string;
    venvPath: string;
    venvPythonPath: string;
  }): void {
    process.env.PYTHON_PATH = pythonPath;
    process.env.VENV_PATH = venvPath;
    process.env.VENV_PYTHON_PATH = venvPythonPath;
    process.env.PIP_DISABLE_PIP_VERSION_CHECK = '1';
    process.env.PYTHONNOUSERSITE = '1';

    paths.venvPython = venvPythonPath;
  }

  private getVenvPythonPath(venvPath: string): string {
    return os.platform() === 'win32'
      ? path.join(venvPath, 'Scripts', 'python.exe')
      : path.join(venvPath, 'bin', 'python');
  }

  private getRequirementsPath(): string {
    const bundledRequirements = path.join(app.getAppPath(), 'requirements.txt');
    if (fs.existsSync(bundledRequirements)) {
      return bundledRequirements;
    }

    return path.join(this.venvRoot, 'requirements.txt');
  }

  private async executeEnvSetupScript(): Promise<void> {
    if (app.isPackaged) {
      this.log('Skipping envPath.js generation in packaged app.');
      return;
    }

    const envPathFile = generateEnvPathFile(
      app.getAppPath(),
      process.env.PYTHON_PATH,
    );
    this.log(`envPath.js written to ${envPathFile}`);
  }

  private get venvRoot(): string {
    return app.isPackaged
      ? path.join(app.getPath('userData'), 'application')
      : path.join(app.getAppPath(), 'application');
  }

  private async removeVenvDirectory(venvPath: string): Promise<void> {
    if (!fs.existsSync(venvPath)) {
      return;
    }

    this.log(`Removing virtual environment: ${venvPath}`);
    await fs.promises.rm(venvPath, {
      recursive: true,
      force: true,
    });
  }

  private log(message: string): void {
    this.logger?.(message);
  }
}

export default PythonStartupSetup;
