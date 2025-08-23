import React from 'react';
import { AbstractInputConfig } from './AbstractInputConfig';
import { ImageInputConfig } from './ImageInputConfig';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export class ImageInputConfigImpl extends AbstractInputConfig {
  getConfigComponent() {
    const properties = this.getProperties(this.selectedNode);
    return (
      <ImageInputConfig
        onSaveReady={this.onSaveReady}
        selectedNode={this.selectedNode}
        properties={properties}
      />
    );
  }

  getTitle() {
    return 'Image Input Configuration';
  }

  validate() {
    // Add specific validation logic for image input
    return {
      isValid: true,
      errors: [],
    };
  }

  getProperties(selectedNode) {
    const nodeManager = ModelNodeManager.getInstance();
    const nodePrams = nodeManager.getNode(selectedNode?.id);

    const properties = {};
    nodePrams.parameters.forEach((param) => {
      properties[param.name] = param.value || '';
    });

    return {
      Folder: properties.Folder || '',
      'Number of Classes': properties['Number of Classes'] || '',
      'Total Images': properties['Total Images'] || '',
      'Selected Classes': properties['Selected Classes'] || [],
      'Class Statistics': properties['Class Statistics'] || {},
    };
  }
}
