/**
 * Detects cycles in a directed graph represented as a set of edges.
 * The graph is represented using an adjacency list data structure.
 */
export class CycleDetector {
  private adjacencyList: Map<number, number[]>;

  constructor(edges: any) {
    this.adjacencyList = new Map();

    // Build adjacency list from edges
    edges.forEach((edge: any) => {
      const from = edge.from;
      const to = edge.to;

      if (!this.adjacencyList.has(from)) {
        this.adjacencyList.set(from, []);
      }
      if (!this.adjacencyList.has(to)) {
        this.adjacencyList.set(to, []);
      }

      this.adjacencyList.get(from)!.push(to);
    });
  }

  hasCycle(): boolean {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();

    const dfs = (node: number): boolean => {
      visited.add(node);
      recursionStack.add(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (recursionStack.has(neighbor)) {
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    // Check each node as there might be disconnected components
    for (const node of this.adjacencyList.keys()) {
      if (!visited.has(node)) {
        if (dfs(node)) return true;
      }
    }

    return false;
  }
}
