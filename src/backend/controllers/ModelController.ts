import { GraphController } from './GraphController';

export class ModelController {
  trainModel(modelGraph: any) {
    const graphController = new GraphController();
    graphController.setGraphData(modelGraph);

    const sequences = graphController.getLayerSequence();
    console.log(sequences);
  }
}
