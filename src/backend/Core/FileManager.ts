import fs from 'fs';
import path from 'path';

export class FileManager {
  private static instance: FileManager;
  
  private constructor() {}
  
  static getInstance(): FileManager {
    if (!FileManager.instance) {
      FileManager.instance = new FileManager();
    }
    return FileManager.instance;
  }

  async saveFile(filePath: string, content: string): Promise<boolean> {
    try {
      await fs.promises.writeFile(filePath, content, 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async renameFile(oldPath: string, newPath: string): Promise<boolean> {
    try {
      await fs.promises.rename(oldPath, newPath);
      return true;
    } catch (error) {
      console.error('Error renaming file:', error);
      return false;
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async createDirectory(dirPath: string): Promise<boolean> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
      return true;
    } catch (error) {
      console.error('Error creating directory:', error);
      return false;
    }
  }

  getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  getFileName(filePath: string): string {
    return path.basename(filePath);
  }
}
