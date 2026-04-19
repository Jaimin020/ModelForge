import { ModelNode } from '../../../interface/NodeInterface.js';

export class GraphMemento {
  public visNodes: any[];
  public visEdges: any[];
  public modelNodes: ModelNode[];

  constructor(visNodes: any[], visEdges: any[], modelNodes: ModelNode[]) {
    // Deep copy to prevent accidental reference mutations
    this.visNodes = JSON.parse(JSON.stringify(visNodes));
    this.visEdges = JSON.parse(JSON.stringify(visEdges));
    this.modelNodes = JSON.parse(JSON.stringify(modelNodes));
  }
}
