interface NodeParameter {
  name: string;
  type: string;
  value: any;
  required: boolean;
  default?: any;
}

export interface ModelNode {
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

export interface GraphData {
  nodes: ModelNode[];
  edges: Edge[];
}

export interface Edge {
  from: number;
  to: number;
}
