import React from 'react';
import { AbstractInputConfig } from './AbstractInputConfig';
import { TabularInputConfig } from './TabularInputConfig';

export class TabularInputConfigImpl extends AbstractInputConfig {
  getConfigComponent() {
    return (
      <TabularInputConfig
        onSaveReady={this.onSaveReady}
        selectedNode={this.selectedNode}
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
}
