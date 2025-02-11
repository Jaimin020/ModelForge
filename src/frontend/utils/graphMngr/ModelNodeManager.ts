interface NodeParameter {
    name: string;
    type: string;
    value: any;
    required: boolean;
    default?: any;
  }
  
  interface ModelNode {
    id: number; // vis.js node ID
    name: string;
    feature: string;
    library: string;
    inport: number;
    outport: number;
    framework: 'pytorch' | 'tensorflow' | 'keras' | 'onnx';
    codeId: string;
    parameters: NodeParameter[];
    code: string;
    x?: number;
    y?: number;
  }
  
  export class ModelNodeManager {
    private nodes: Map<number, ModelNode>;
    private static instance: ModelNodeManager;
  
    private constructor() {
      this.nodes = new Map();
    }
  
    static getInstance(): ModelNodeManager {
      if (!ModelNodeManager.instance) {
        ModelNodeManager.instance = new ModelNodeManager();
      }
      return ModelNodeManager.instance;
    }
  
    createNode(visNodeId: number, nodeData: Omit<ModelNode, 'id'>): number {
      const newNode: ModelNode = {
        id: visNodeId,
        ...nodeData
      };
      this.nodes.set(visNodeId, newNode);
      return visNodeId;
    }
  
    updateNode(visNodeId: number, updates: Partial<ModelNode>): boolean {
      const node = this.nodes.get(visNodeId);
      if (!node) return false;
  
      this.nodes.set(visNodeId, { ...node, ...updates });
      return true;
    }
  
    getNode(visNodeId: number): ModelNode | undefined {
      return this.nodes.get(visNodeId);
    }
  
    getNodesByFramework(framework: ModelNode['framework']): ModelNode[] {
      return Array.from(this.nodes.values()).filter(node => node.framework === framework);
    }
  
    getAllNodes(): ModelNode[] {
      return Array.from(this.nodes.values());
    }
  
    deleteNode(visNodeId: number): boolean {
      return this.nodes.delete(visNodeId);
    }
  
    updateNodeParameter(visNodeId: number, paramName: string, value: any): boolean {
      const node = this.nodes.get(visNodeId);
      if (!node) return false;
  
      const updatedParams = node.parameters.map(param => 
        param.name === paramName ? { ...param, value } : param
      );
  
      this.nodes.set(visNodeId, { ...node, parameters: updatedParams });
      return true;
    }
  }
  