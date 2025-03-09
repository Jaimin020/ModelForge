import { FileStats } from '../../../interface/SpreadsheetInterface';

declare global {
  interface Window {
    file: {
      readCsvOrExelFile: (filePath: string) => Promise<any>;
    };
  }
}

export class SpreadsheetOps {
  private static instance: SpreadsheetOps;
  private fileData: any = null;
  private currentFilePath: string = '';

  private constructor() {}

  static getInstance(): SpreadsheetOps {
    if (!SpreadsheetOps.instance) {
      SpreadsheetOps.instance = new SpreadsheetOps();
    }
    return SpreadsheetOps.instance;
  }

  async loadFile(filePath: string): Promise<boolean> {
    if (!this.isValidFile(filePath)) {
      return false;
    }

    try {
      this.fileData = await window.file.readCsvOrExelFile(filePath);
      this.currentFilePath = filePath;
      return true;
    } catch (error) {
      this.fileData = null;
      this.currentFilePath = '';
      return false;
    }
  }

  getFileStats(): FileStats | null {
    return this.fileData ? this.fileData.stats : null;
  }

  getData(): any[] {
    return this.fileData ? this.fileData.data : [];
  }

  isValidFile(fileName: string): boolean {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    return validExtensions.includes(extension);
  }

  getFilePath(): string {
    return this.currentFilePath;
  }
}
