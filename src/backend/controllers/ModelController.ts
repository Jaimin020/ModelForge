import { GraphController } from './GraphController';
import { Engine } from '../Core/Engine';
import { FileManager } from '../Core/FileManager';

export class ModelController {
  graphController = new GraphController();
  fileMngr = FileManager.getInstance();

  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const hyperparameters = this.graphController.getHyperparameters();
    const engine = new Engine(sequences,hyperparameters);
    const code = engine.getPyCode();
    const pathToSave = "/Users/jaiminchauhan/MF_Project/demo.py";
    this.fileMngr.saveFile(pathToSave,code);
  }

  saveModel(modelGraph: any) {
    const fileName = 'model.mff';
    const pathToSave = "/Users/jaiminchauhan/MF_Project/" + fileName;
    const content = JSON.stringify(modelGraph);
    this.fileMngr.saveFile(pathToSave,content);
  }

  async loadModel(filePath: string) {
    const content = await this.fileMngr.readFile(filePath);
    const modelGraph = JSON.parse(content?.toString() || '{}');
    return modelGraph;
  }

}
