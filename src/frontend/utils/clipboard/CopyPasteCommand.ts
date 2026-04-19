import { NodeMemento } from './NodeMemento';
import { ModelNodeManager } from '../graphMngr/ModelNodeManager';

export class CopyPasteCommand {
  private memento: NodeMemento | null = null;
  private nodeManager: ModelNodeManager;

  constructor() {
    this.nodeManager = ModelNodeManager.getInstance();
  }

  public copy(nodeId: number): void {
    const nodeState = this.nodeManager.getNode(nodeId);
    if (nodeState) {
      this.memento = new NodeMemento(nodeState);
      console.log('Node copied:', nodeState.name);
    } else {
      console.warn(`Cannot copy node ${nodeId}, it does not exist in ModelNodeManager.`);
    }
  }

  public hasMemento(): boolean {
    return this.memento !== null;
  }

  public paste(nodesDataSet: any, canvasX: number, canvasY: number): void {
    if (!this.memento) {
      console.warn('Clipboard empty, nothing to paste');
      return;
    }

    const savedState = this.memento.getState();
    const newId = Math.random() * 1e7;

    this.nodeManager.createNode(newId, {
      name: savedState.name,
      feature: savedState.feature,
      library: savedState.library,
      framework: savedState.framework,
      codeId: savedState.codeId,
      inport: savedState.inport,
      outport: savedState.outport,
      parameters: savedState.parameters,
      code: savedState.code,
    });

    nodesDataSet.add({
      id: newId,
      x: canvasX,
      y: canvasY,
      label: savedState.name,
    });

    console.log('Node pasted:', savedState.name, 'at', canvasX, canvasY);
  }
}
