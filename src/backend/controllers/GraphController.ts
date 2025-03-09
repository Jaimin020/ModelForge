import { ModelNode } from '../../interface/NodeInterface';
import { GraphService } from '../services/GraphService';

export class GraphController {
  private graphService = GraphService.getInstance();
  getLayerSequence(): ModelNode[] {
    return this.graphService.getSequentialLayers();
  }

  setGraphData(data: any): void {
    this.graphService.setGraphData({
      nodes: data.nodes,
      edges: data.edges,
      hyperparameters: data.hyperparameters,
    });
  }

  getGraphData() {
    return {
      nodes: this.graphService.getAllNodes(),
      edges: this.graphService.getAllEdges(),
      hyperparameters: this.graphService.getHyperparameters(),
    };
  }

  getHyperparameters() {
    return this.graphService.getHyperparameters();
  }
}
