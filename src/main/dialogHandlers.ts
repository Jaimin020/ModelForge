import { BrowserWindow, dialog } from 'electron';

interface FileFilter {
  name: string;
  extensions: string[];
}

interface SaveOptions {
  defaultName: string;
  extensions: string[];
}

/**
 * Opens a file selection dialog and returns the selected file path
 * @param window The browser window to attach the dialog to
 * @param filters File filter options
 * @param isDirectory Whether to select directories instead of files
 * @returns The selected file path or null if canceled
 */
export async function selectFilePath(
  window: any,
  filters: FileFilter,
  isDirectory: boolean,
): Promise<string | null> {
  const properties: (
    | 'openFile'
    | 'openDirectory'
    | 'multiSelections'
    | 'showHiddenFiles'
    | 'createDirectory'
    | 'promptToCreate'
    | 'noResolveAliases'
    | 'treatPackageAsDirectory'
    | 'dontAddToRecent'
  )[] = isDirectory ? ['openDirectory'] : ['openFile'];

  const options: any = { properties };

  // Only include filters if extensions is not '*' (all files)
  if (filters && filters.extensions && !filters.extensions.includes('*')) {
    options.filters = [filters];
  }

  const result = await dialog.showOpenDialog(window, options);

  return result.canceled ? null : result.filePaths[0] || null;
}

/**
 * Opens a save file dialog and returns the selected file path
 * @param options Save dialog options
 * @returns The selected save path or null if canceled
 */
export async function selectSaveFilePath(
  options: SaveOptions,
): Promise<string | null> {
  const result = await dialog.showSaveDialog({
    defaultPath: options.defaultName,
    filters: [{ name: 'Files', extensions: options.extensions }],
  });

  return result.canceled ? null : result.filePath || null;
}
