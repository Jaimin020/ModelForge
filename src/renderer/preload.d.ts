import { ElectronHandler } from '../main/preload';
import { PythonHandler } from '../main/preload';
import { DialogHandler } from '../main/preload';
import { FileHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    api: PythonHandler;
    dialog: DialogHandler;
    file: FileHandler;
    backend: any;
    windowMngr: any;
  }
}

export {};
