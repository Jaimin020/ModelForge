import { CycleDetector } from '../graphUtils/CycleDetector';
import { ModelNodeManager } from '../graphMngr/ModelNodeManager';

export class GraphAnalyzer {
  private modelNodeManager: ModelNodeManager;

  constructor() {
    this.modelNodeManager = ModelNodeManager.getInstance();
  }

  validateGraph(edges: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const nodes = this.modelNodeManager.getAllNodes();

    // Check 1: Validate all required properties have values
    const propertyValidation = this.validateRequiredProperties();
    if (!propertyValidation.isValid) {
      errors.push(...propertyValidation.errors);
      return { isValid: false, errors };
    }

    // Check 2: Validate port connections
    const portValidation = this.validatePortConnections(edges);
    if (!portValidation.isValid) {
      errors.push(...portValidation.errors);
      return { isValid: false, errors };
    }

    // Check 3: No cycles allowed
    const cycleDetector = new CycleDetector(edges);
    if (cycleDetector.hasCycle()) {
      errors.push('Graph contains cycles');
      return { isValid: false, errors };
    }

    // Check 4: No disconnected components
    if (!this.isSingleConnectedComponent(edges)) {
      errors.push('Graph contains disconnected components');
      return { isValid: false, errors };
    }

    // Check 5: First node must be input
    const startNodes = this.findStartNodes(edges);
    if (
      startNodes.length !== 1 ||
      !nodes
        .find((n) => n.id === startNodes[0])
        ?.feature.toLowerCase()
        .includes('input')
    ) {
      errors.push('Graph must start with exactly one input node');
      return { isValid: false, errors };
    }

    // Check 6: Last node must be loss function
    const endNodes = this.findEndNodes(edges);
    if (
      endNodes.length !== 1 ||
      !nodes
        .find((n) => n.id === endNodes[0])
        ?.feature.toLowerCase()
        .includes('loss')
    ) {
      errors.push('Graph must end with exactly one loss function node');
      return { isValid: false, errors };
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private findStartNodes(edges: any[]): number[] {
    const nodes = new Set(this.modelNodeManager.getAllNodes().map((n) => n.id));
    const hasIncoming = new Set(edges.map((e) => e.to));
    return Array.from(nodes).filter((n) => !hasIncoming.has(n));
  }

  private findEndNodes(edges: any[]): number[] {
    const nodes = new Set(this.modelNodeManager.getAllNodes().map((n) => n.id));
    const hasIncoming = new Set(edges.map((e) => e.from));
    return Array.from(nodes).filter((n) => !hasIncoming.has(n));
  }

  private isSingleConnectedComponent(edges: any): boolean {
    if (edges.length === 0) return false;

    const nodes = new Set(this.modelNodeManager.getAllNodes().map((n) => n.id));
    const visited = new Set<number>();

    const dfs = (node: number) => {
      visited.add(node);
      edges.forEach((edge: any) => {
        if (edge.from === node && !visited.has(edge.to)) {
          dfs(edge.to);
        }
      });
    };

    // Start DFS from the first node
    dfs(edges[0].from);

    // Check if all nodes were visited
    return visited.size === nodes.size;
  }

  private validatePortConnections(edges: any[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const incomingConnections = new Map<number, number>();
    const outgoingConnections = new Map<number, number>();

    edges.forEach((edge) => {
      // Count incoming connections
      incomingConnections.set(
        edge.to,
        (incomingConnections.get(edge.to) || 0) + 1,
      );
      // Count outgoing connections
      outgoingConnections.set(
        edge.from,
        (outgoingConnections.get(edge.from) || 0) + 1,
      );
    });

    // Verify inport connections
    incomingConnections.forEach((count, nodeId) => {
      const node = this.modelNodeManager.getNode(nodeId);
      if (node && node.inport !== count) {
        errors.push(
          `Node ${node.name} requires ${node.inport} input connections but has ${count}`,
        );
      }
    });

    // Verify outport connections
    outgoingConnections.forEach((count, nodeId) => {
      const node = this.modelNodeManager.getNode(nodeId);
      if (node && node.outport !== count) {
        errors.push(
          `Node ${node.name} requires ${node.outport} output connections but has ${count}`,
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateRequiredProperties(): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const nodes = this.modelNodeManager.getAllNodes();

    nodes.forEach((node) => {
      if (!node.parameters || node.parameters.length === 0) {
        return; // Skip nodes without parameters
      }

      node.parameters.forEach((parameter) => {
        // Check if parameter is required and has no value
        if (parameter.required && this.isEmptyValue(parameter.value)) {
          errors.push(
            `Node "${node.name}" is missing required property "${parameter.name}"`
          );
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isEmptyValue(value: any): boolean {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return true;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
    
    return false;
  }
}
