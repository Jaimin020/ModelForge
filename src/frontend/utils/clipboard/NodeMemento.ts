import { ModelNode } from '../../../interface/NodeInterface.js';

export class NodeMemento {
  private state: ModelNode;

  constructor(state: ModelNode) {
    // Deep copy to prevent mutating the memento reference if the original node is modified later
    this.state = JSON.parse(JSON.stringify(state));
  }

  public getState(): ModelNode {
    return JSON.parse(JSON.stringify(this.state));
  }
}
