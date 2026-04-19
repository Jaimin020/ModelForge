import { ModelNode } from '../../../interface/NodeInterface';

export interface CopiedNode {
  state: ModelNode;
  relativeX: number;
  relativeY: number;
}

export interface CopiedEdge {
  fromOldId: number;
  toOldId: number;
  data: any;
}

export class NodeMemento {
  public copiedNodes: CopiedNode[];
  public copiedEdges: CopiedEdge[];

  constructor(nodes: CopiedNode[], edges: CopiedEdge[]) {
    // Deep copy to prevent mutating the memento reference
    this.copiedNodes = JSON.parse(JSON.stringify(nodes));
    this.copiedEdges = JSON.parse(JSON.stringify(edges));
  }
}
