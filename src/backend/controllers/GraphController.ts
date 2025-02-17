import { ModelNode } from '../../interface/NodeInterface';
import { GraphService } from '../services/GraphService';

export class GraphController {
  private graphService = GraphService.getInstance();
  getLayerSequence(): ModelNode[] {
    return this.graphService.getSequentialLayers();
  }

  setGraphData(data: any): void {
    this.graphService.setGraphData(data);
  }
}
