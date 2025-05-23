import { ModelNodeManager } from '../graphMngr/ModelNodeManager';

export class GraphDataManager {
  private static instance: GraphDataManager;
  private nodes: any;
  private edges: any;
  private hyperparameters: any;

  private constructor() {}

  static getInstance(): GraphDataManager {
    if (!GraphDataManager.instance) {
      GraphDataManager.instance = new GraphDataManager();
    }
    return GraphDataManager.instance;
  }

  setNodes(nodes: any) {
    this.nodes = nodes;
  }

  setEdges(edges: any) {
    this.edges = edges;
  }

  setHyperparameters(hyperparameters: any) {
    this.hyperparameters = hyperparameters;
  }

  getNodes() {
    return this.nodes;
  }

  getEdges() {
    return this.edges;
  }

  getHyperparameters() {
    return this.hyperparameters;
  }

  clearAllNodesAndEdges() {
    this.nodes = [];
    this.edges = [];
    const nodeManager = ModelNodeManager.getInstance();
    nodeManager.clearAllNodes();
  }

  getGraphDataAsJson() {
    const nodeManager = ModelNodeManager.getInstance();
    const nodesData = this.nodes.current.get().map((node: any) => {
      const modelNode = nodeManager.getNode(node.id);
      return {
        ...node,
        ...modelNode,
      };
    });

    const edgesData = this.edges.current.get();

    return {
      nodes: nodesData,
      edges: edgesData,
      hyperparameters: this.hyperparameters,
    };
  }
}
