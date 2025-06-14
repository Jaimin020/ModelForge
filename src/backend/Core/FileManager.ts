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

  async analyzeImageDatasetFolder(folderPath: string): Promise<{
    folders: { folderName: string; imageCount: number }[];
    totalImages: number;
  } | null> {
    try {
      // Check if the folder exists
      const folderExists = await this.fileExists(folderPath);
      if (!folderExists) {
        console.error('Dataset folder does not exist:', folderPath);
        return null;
      }

      // Read the contents of the main folder
      const items = await fs.promises.readdir(folderPath, { withFileTypes: true });
      
      // Filter only directories (subfolders)
      const subfolders = items.filter(item => item.isDirectory());
      
      const folders: { folderName: string; imageCount: number }[] = [];
      let totalImages = 0;
      
      // Common image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.svg'];
      
      // Process each subfolder
      for (const subfolder of subfolders) {
        const subfolderPath = path.join(folderPath, subfolder.name);
        
        try {
          // Read contents of the subfolder
          const subfolderItems = await fs.promises.readdir(subfolderPath);
          
          // Count image files in the subfolder
          const imageCount = subfolderItems.filter(item => {
            const extension = path.extname(item).toLowerCase();
            return imageExtensions.includes(extension);
          }).length;
          
          folders.push({
            folderName: subfolder.name,
            imageCount: imageCount
          });
          
          // Add to total count
          totalImages += imageCount;
        } catch (error) {
          console.error(`Error reading subfolder ${subfolder.name}:`, error);
          // Add the folder with 0 count if there's an error reading it
          folders.push({
            folderName: subfolder.name,
            imageCount: 0
          });
        }
      }
      
      // Sort by folder name for consistent output
      folders.sort((a, b) => a.folderName.localeCompare(b.folderName));
      
      return {
        folders,
        totalImages
      };
    } catch (error) {
      console.error('Error analyzing image dataset folder:', error);
      return null;
    }
  }
}
