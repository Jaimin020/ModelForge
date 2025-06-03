export type DiagnosticType = 'info' | 'warn' | 'error' | 'success' | 'none';

export interface DiagnosticEntry {
  type: DiagnosticType;
  message: string;
}

// Function to create a diagnostic entry
export const createDiagnosticEntry = (
  message: string,
  type: DiagnosticType = 'info',
): DiagnosticEntry => ({
  message,
  type,
});

// Function to append diagnostic to current output
export const appendDiagnostic = (
  currentLogs: DiagnosticEntry[],
  message: string,
  type: DiagnosticType = 'info',
): DiagnosticEntry[] => {
  const newEntry = createDiagnosticEntry(message, type);
  return [...currentLogs, newEntry];
};
