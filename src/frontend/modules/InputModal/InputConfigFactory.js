import { TabularInputConfigImpl } from './TabularInputConfigImpl';
import { ImageInputConfigImpl } from './ImageInputConfigImpl';

export class InputConfigFactory {
  static createInputConfig(selectedNode, onSaveReady) {
    if (!selectedNode) {
      throw new Error('Selected node is required');
    }

    const nodeType = selectedNode.label?.toLowerCase();

    // Determine config type based on node properties
    if (nodeType?.includes('tabular')) {
      return new TabularInputConfigImpl(selectedNode, onSaveReady);
    }
    if (nodeType?.includes('image')) {
      return new ImageInputConfigImpl(selectedNode, onSaveReady);
    }
    // Default fallback - you can customize this logic
    return new TabularInputConfigImpl(selectedNode, onSaveReady);
  }

  static getSupportedTypes() {
    return ['tabular', 'image'];
  }
}
