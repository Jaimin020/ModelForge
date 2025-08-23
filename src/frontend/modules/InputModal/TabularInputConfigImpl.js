import React from 'react';
import { AbstractInputConfig } from './AbstractInputConfig';
import { TabularInputConfig } from './TabularInputConfig';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export class TabularInputConfigImpl extends AbstractInputConfig {
  getConfigComponent() {
    const properties = this.getProperties(this.selectedNode);
    return (
      <TabularInputConfig
        onSaveReady={this.onSaveReady}
        selectedNode={this.selectedNode}
        properties={properties}
      />
    );
  }

  getTitle() {
    return 'Tabular Input Configuration';
  }

  validate() {
    // Add specific validation logic for tabular input
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
      File: properties.File || '',
      'Number of Features': properties['Number of Features'] || '',
      'Number of Predictor': properties['Number of Predictor'] || '',
      'Selected Feature': properties['Selected Feature'] || [],
      'Selected Predictor': properties['Selected Predictor'] || '',
    };
  }
}
