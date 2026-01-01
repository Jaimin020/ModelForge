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
   * Auto-detect Python installation paths using IPC
   */
  public async detectPythonPaths(): Promise<string[]> {
    try {
      if (window.api && window.api.detectPythonPaths) {
        return await window.api.detectPythonPaths();
      }
      // Fallback for development/testing
      return [];
    } catch (error) {
      console.error('Failed to detect Python paths:', error);
      return [];
    }
  }

  /**
   * Validate a Python path and get version information using IPC
   */
  public async validatePythonPath(
    pythonPath: string,
  ): Promise<PythonPathValidationResult> {
    try {
      if (window.api && window.api.validatePythonPath) {
        return await window.api.validatePythonPath(pythonPath);
      }
      // Fallback for development/testing
      return {
        isValid: false,
        path: pythonPath,
        error: 'Python validation not available in this environment',
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
