import React from 'react';
import { AbstractInputConfig } from './AbstractInputConfig';
import { ImageInputConfig } from './ImageInputConfig';

export class ImageInputConfigImpl extends AbstractInputConfig {
  getConfigComponent() {
    return (
      <ImageInputConfig
        onSaveReady={this.onSaveReady}
        selectedNode={this.selectedNode}
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
      errors: []
    };
  }
}
