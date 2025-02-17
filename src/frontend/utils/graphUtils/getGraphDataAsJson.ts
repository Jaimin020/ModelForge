import { ModelNodeManager } from '../graphMngr/ModelNodeManager';

export const getGraphDataAsJson = (nodes: any, edges: any) => {
  const nodeManager = ModelNodeManager.getInstance();
  const nodesData = nodes.current.get().map((node: any) => {
    const modelNode = nodeManager.getNode(node.id);
    return {
      ...node,
      ...modelNode,
    };
  });

  const edgesData = edges.current.get();

  return {
    nodes: nodesData,
    edges: edgesData,
  };
};
