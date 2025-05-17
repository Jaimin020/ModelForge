import { GraphController } from './GraphController';
import { Engine } from '../Core/Engine';
import { FileManager } from '../Core/FileManager';
import { TEST_PY_FILE, TEST_DIR } from '../../envPath';
import path from 'path';

export class ModelController {
  graphController = new GraphController();
  fileMngr = FileManager.getInstance();

  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const hyperparameters = this.graphController.getHyperparameters();
    const engine = new Engine(sequences, hyperparameters);
    const code = engine.getPyCode();
    const pathToSave = TEST_PY_FILE;
    this.fileMngr.saveFile(pathToSave, code);
  }

  async saveModel(modelGraph: any) {
    const fileName = 'model.mff';
    const pathToSave = path.join(TEST_DIR, fileName);
    const content = JSON.stringify(modelGraph);
    this.fileMngr.saveFile(pathToSave, content);
    return pathToSave;
  }

  async loadModel(filePath: string) {
    const content = await this.fileMngr.readFile(filePath);
    const modelGraph = JSON.parse(content?.toString() || '{}');
    return modelGraph;
  }
}
