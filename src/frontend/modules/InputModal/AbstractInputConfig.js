export class AbstractInputConfig {
    constructor(selectedNode, onSaveReady) {
      if (this.constructor === AbstractInputConfig) {
        throw new Error("Abstract class cannot be instantiated directly");
      }
      this.selectedNode = selectedNode;
      this.onSaveReady = onSaveReady;
    }
  
    // Abstract methods that must be implemented by subclasses
    getConfigComponent() {
      throw new Error("getConfigComponent method must be implemented");
    }
  
    getTitle() {
      throw new Error("getTitle method must be implemented");
    }
  
    validate() {
      throw new Error("validate method must be implemented");
    }
  
    // Common utility methods
    getNodeType() {
      return this.selectedNode?.type || 'unknown';
    }
  
    getNodeFeature() {
      return this.selectedNode?.feature || 'unknown';
    }
  }
  