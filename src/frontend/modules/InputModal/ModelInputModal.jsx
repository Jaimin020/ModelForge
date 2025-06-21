import React, { useState, useCallback, useMemo } from 'react';
import { CommonConfig } from './CommonConfig';
import { CommonFooter } from './CommonFooter';
import { TabularInputConfig } from './TabularInputConfig';
import { ImageInputConfig } from './ImageInputConfig';
import { InputModalTemplate } from './InputModelTemplate';
import { InputConfigFactory } from './InputConfigFactory';

export const ModelInputModal = ({ isOpen, onClose, selectedNode }) => {
  if (!isOpen) {
    return null;
  }
  const [saveHandlers, setSaveHandlers] = useState({});

  const handleSaveReady = useCallback((componentName, saveHandler) => {
    setSaveHandlers((prev) => ({
      ...prev,
      [componentName]: saveHandler,
    }));
  }, []);


  // Create the appropriate input config based on selected node
  const inputConfig = useMemo(() => {
    try {
      return InputConfigFactory.createInputConfig(selectedNode, handleSaveReady);
    } catch (error) {
      console.error('Error creating input config:', error);
      return null;
    }
  }, [selectedNode]);

  const handleSave = () => {
    // Call all registered save handlers
    Object.values(saveHandlers).forEach((handler) => {
      if (typeof handler === 'function') {
        handler();
      }
    });
    onClose();
  };
  // Handle case where config couldn't be created
  if (!inputConfig) {
    return (
      <InputModalTemplate
        title="Error"
        leftPanel={
          <div>
            <p>Unable to load configuration for the selected node.</p>
            <p>Node type: {selectedNode?.type || 'Unknown'}</p>
            <p>Node feature: {selectedNode?.feature || 'Unknown'}</p>
          </div>
        }
        rightPanel={
          <CommonConfig
            onSaveReady={handleSaveReady}
            selectedNode={selectedNode}
          />
        }
        footer={<CommonFooter onSave={onClose} onClose={onClose} />}
      />
    );
  }
  return (
    <InputModalTemplate
      title={inputConfig.getTitle()}
      leftPanel={inputConfig.getConfigComponent()}
      rightPanel={
        <CommonConfig
          onSaveReady={handleSaveReady}
          selectedNode={selectedNode}
        />
      }
      footer={<CommonFooter onSave={handleSave} onClose={onClose} />}
    />
  );
};
