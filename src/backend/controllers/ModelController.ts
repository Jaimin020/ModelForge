import { GraphController } from './GraphController';
import { Engine } from './../CodeGenEngine/Engine';
export class ModelController {
  graphController = new GraphController();
  trainModel(modelGraph: any) {
    this.graphController.setGraphData(modelGraph);

    const sequences = this.graphController.getLayerSequence();
    const engine = new Engine(sequences.slice(1, -1));
    // console.log(engine.getPyCode());
  }
}
