import { NodeMemento, CopiedNode, CopiedEdge } from './NodeMemento';
import { ModelNodeManager } from '../graphMngr/ModelNodeManager';

export class CopyPasteCommand {
  private memento: NodeMemento | null = null;
  private nodeManager: ModelNodeManager;

  constructor() {
    this.nodeManager = ModelNodeManager.getInstance();
  }

  public copy(
    selectedNodeIds: number[],
    selectedEdgeIds: number[],
    visNodes: any,
    visEdges: any,
    positions: Record<number, { x: number; y: number }>,
  ): void {
    if (!selectedNodeIds || selectedNodeIds.length === 0) return;

    let sumX = 0,
      sumY = 0;
    const validNodes: Array<{
      id: number;
      pos: { x: number; y: number };
      state: any;
    }> = [];

    for (const id of selectedNodeIds) {
      const pos = positions[id];
      if (pos) {
        sumX += pos.x;
        sumY += pos.y;
        const modelInfo = this.nodeManager.getNode(id);
        if (modelInfo) {
          validNodes.push({ id, pos, state: modelInfo });
        }
      }
    }

    if (validNodes.length === 0) return;

    const centerX = sumX / validNodes.length;
    const centerY = sumY / validNodes.length;

    const copiedNodes: CopiedNode[] = validNodes.map((n) => ({
      state: n.state,
      relativeX: n.pos.x - centerX,
      relativeY: n.pos.y - centerY,
    }));

    const copiedEdges: CopiedEdge[] = [];
    const selectedNodesSet = new Set(selectedNodeIds);

    for (const edgeId of selectedEdgeIds) {
      const edgeData = visEdges.get(edgeId);
      // Only copy edge if BOTH endpoints are within the copied selection group.
      if (
        edgeData &&
        selectedNodesSet.has(edgeData.from) &&
        selectedNodesSet.has(edgeData.to)
      ) {
        copiedEdges.push({
          fromOldId: edgeData.from,
          toOldId: edgeData.to,
          data: edgeData,
        });
      }
    }

    this.memento = new NodeMemento(copiedNodes, copiedEdges);
    console.log(
      `Copied ${copiedNodes.length} nodes and ${copiedEdges.length} edges.`,
    );
  }

  public hasMemento(): boolean {
    return this.memento !== null;
  }

  public paste(
    visNodes: any,
    visEdges: any,
    canvasX: number,
    canvasY: number,
  ): void {
    if (!this.memento) {
      console.warn('Clipboard empty, nothing to paste');
      return;
    }

    const idMapping = new Map<number, number>();

    this.memento.copiedNodes.forEach((copiedNode) => {
      const newId = Math.random() * 1e7;
      const oldId = copiedNode.state.id;
      idMapping.set(oldId, newId);

      this.nodeManager.createNode(newId, {
        name: copiedNode.state.name,
        feature: copiedNode.state.feature,
        library: copiedNode.state.library,
        framework: copiedNode.state.framework,
        codeId: copiedNode.state.codeId,
        inport: copiedNode.state.inport,
        outport: copiedNode.state.outport,
        parameters: copiedNode.state.parameters,
        code: copiedNode.state.code,
      });

      visNodes.add({
        id: newId,
        x: canvasX + copiedNode.relativeX,
        y: canvasY + copiedNode.relativeY,
        label: copiedNode.state.name,
      });
    });

    this.memento.copiedEdges.forEach((copiedEdge) => {
      const newFrom = idMapping.get(copiedEdge.fromOldId);
      const newTo = idMapping.get(copiedEdge.toOldId);

      if (newFrom && newTo) {
        // Create duplicate edge but substitute new mapped IDs
        visEdges.add({
          ...copiedEdge.data,
          id: Math.random() * 1e7,
          from: newFrom,
          to: newTo,
        });
      }
    });

    console.log(
      `Pasted ${this.memento.copiedNodes.length} nodes and ${this.memento.copiedEdges.length} edges.`,
    );
  }
}
