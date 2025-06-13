import React, { useState, useCallback } from 'react';
import { CommonConfig } from "./CommonConfig";
import { CommonFooter } from "./CommonFooter";
import { TabularInputConfig } from "./TabularInputConfig";
import { InputModalTemplate } from "./InputModelTemplate";

export const ModelInputModal = ({ isOpen, onClose, selectedNode }) => {
    if(!isOpen)
    {
        return null;
    }
    const [saveHandlers, setSaveHandlers] = useState({});

    const handleSaveReady = useCallback((componentName, saveHandler) => {
        setSaveHandlers(prev => ({
            ...prev,
            [componentName]: saveHandler
        }));
    }, []);

    const handleSave = () => {
        // Call all registered save handlers
        Object.values(saveHandlers).forEach(handler => {
            if (typeof handler === 'function') {
                handler();
            }
        });
        onClose();
    }
    return (
        <InputModalTemplate
          title={"Tabular Input"}
          leftPanel={<TabularInputConfig onSaveReady={handleSaveReady} selectedNode={selectedNode}/>}
          rightPanel={<CommonConfig onSaveReady={handleSaveReady} selectedNode={selectedNode}/>}
          footer={<CommonFooter onSave = {handleSave} onClose={onClose}/>}
        />
      );
}