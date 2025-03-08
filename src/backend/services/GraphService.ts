import { ModelNode, GraphData, Edge } from '../../interface/NodeInterface';

export class GraphService {
  private static instance: GraphService;
  private nodes: Map<number, ModelNode>;
  private edges: Edge[];
  private hyperparameters: any;

  private constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.hyperparameters = {};
  }

  static getInstance(): GraphService {
    if (!GraphService.instance) {
      GraphService.instance = new GraphService();
    }
    return GraphService.instance;
  }

  setGraphData(data: GraphData & { hyperparameters?: any }): void {
    this.nodes.clear();
    data.nodes.forEach((node: ModelNode) => {
      this.nodes.set(node.id, node);
    });
    this.edges = [...data.edges];
    if (data.hyperparameters) {
      this.hyperparameters = data.hyperparameters;
    }
  }

  getNodeById(id: number): ModelNode | undefined {
    return this.nodes.get(id);
  }

  getNodesByFramework(framework: string): ModelNode[] {
    return Array.from(this.nodes.values()).filter(
      (node) => node.framework === framework,
    );
  }

  getConnectedNodes(nodeId: number): ModelNode[] {
    const connectedIds = this.edges
      .filter((edge) => edge.from === nodeId || edge.to === nodeId)
      .map((edge) => (edge.from === nodeId ? edge.to : edge.from));

    return connectedIds
      .map((id) => this.nodes.get(id))
      .filter(Boolean) as ModelNode[];
  }

  getAllNodes(): ModelNode[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): Edge[] {
    return this.edges;
  }

  getHyperparameters(): any {
    return this.hyperparameters;
  }

  getSequentialLayers(): ModelNode[] {
    if (this.edges.length === 0) return [];

    // Find start node (node with no incoming edges)
    const incomingEdges = new Map<number, number>();
    this.edges.forEach((edge) => {
      incomingEdges.set(edge.to, (incomingEdges.get(edge.to) || 0) + 1);
    });

    const startNode = Array.from(this.nodes.keys()).find(
      (nodeId) => !incomingEdges.has(nodeId),
    );

    if (!startNode) return [];

    // Perform BFS
    const queue: number[] = [startNode];
    const visited = new Set<number>();
    const result: ModelNode[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;

      visited.add(currentId);
      const node = this.nodes.get(currentId);
      if (node) result.push(node);

      // Get all outgoing edges
      const outgoingNodes = this.edges
        .filter((edge) => edge.from === currentId)
        .map((edge) => edge.to);

      queue.push(...outgoingNodes);
    }

    return result;
  }
}
