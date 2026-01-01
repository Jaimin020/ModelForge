export interface SettingsData {
  pythonPath: string;
  gpu: string;
  environment: 'PyTorch' | 'TensorFlow';
}

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: SettingsData;

  private constructor() {
    // Default settings
    this.settings = {
      pythonPath: '',
      gpu: 'auto',
      environment: 'PyTorch',
    };
    this.loadSettings();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('modelforge-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.warn('Failed to load settings from localStorage:', error);
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(
        'modelforge-settings',
        JSON.stringify(this.settings),
      );
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  }

  public getSettings(): SettingsData {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SettingsData>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getPythonPath(): string {
    return this.settings.pythonPath;
  }

  public setPythonPath(path: string): void {
    this.settings.pythonPath = path;
    this.saveSettings();
  }

  public getGPU(): string {
    return this.settings.gpu;
  }

  public setGPU(gpu: string): void {
    this.settings.gpu = gpu;
    this.saveSettings();
  }

  public getEnvironment(): 'PyTorch' | 'TensorFlow' {
    return this.settings.environment;
  }

  public setEnvironment(env: 'PyTorch' | 'TensorFlow'): void {
    this.settings.environment = env;
    this.saveSettings();
  }
}

export default SettingsManager;
