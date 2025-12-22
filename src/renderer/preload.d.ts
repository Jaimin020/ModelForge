export interface PythonPathValidationResult {
  isValid: boolean;
  path: string;
  version?: string;
  error?: string;
  warning?: string;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    api: {
      runPython: (scriptPath: string) => Promise<any>;
      stopPython: () => Promise<any>;
      detectPythonPaths: () => Promise<string[]>;
      validatePythonPath: (
        pythonPath: string,
      ) => Promise<PythonPathValidationResult>;
    };
  }
}

export {};
