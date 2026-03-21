import { BrowserWindow, dialog } from 'electron';

export async function selectFilePath(
  browserWindow: BrowserWindow | null,
  fileFormat: { name: string; extensions: string[] },
  isFolderType: boolean,
): Promise<string | null> {
  const result = isFolderType
    ? await dialog.showOpenDialog(browserWindow!, {
        properties: ['openDirectory'],
      })
    : await dialog.showOpenDialog(browserWindow!, {
        properties: ['openFile'],
        filters: [fileFormat],
      });

  return result.canceled ? null : result.filePaths[0];
}

export async function selectSaveFilePath({
  defaultName,
  extensions,
}: {
  defaultName: string;
  extensions: string[];
}): Promise<string | null> {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: defaultName,
    filters: [
      {
        name: 'Files',
        extensions,
      },
    ],
  });

  return canceled ? null : filePath;
}
