import { GraphController } from './GraphController';
import { Engine } from '../Core/Engine';
export class ModelController {
  graphController = new GraphController();
  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const hyperparameters = this.graphController.getHyperparameters();
    const engine = new Engine(sequences,hyperparameters);
    console.log(engine.getPyCode());
  }
}
