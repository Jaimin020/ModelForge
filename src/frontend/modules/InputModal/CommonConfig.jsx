import React, { useEffect, useState } from 'react';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export const CommonConfig = ({ selectedNode, onSaveReady }) => {
  const handleSave = () => {
    const updatedNode = [
      {
        name: 'Train Split',
        value: datasetSplit.train,
      },
      {
        name: 'Test Split',
        value: datasetSplit.test,
      },
      {
        name: 'Validation Split',
        value: datasetSplit.validation,
      },
    ];
    // Update the node with new parameters
    const nodeManager = ModelNodeManager.getInstance();
    nodeManager.updateMultipleNodeParameters(selectedNode.id, updatedNode);
  };
  // Register the save handler with parent
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady('commonConfig', handleSave);
    }
  }, [onSaveReady]);

  const [datasetSplit, setDatasetSplit] = useState({
    train: 80,
    test: 10,
    validation: 10,
  });
  return (
    <div style={{ flex: 1 }}>
      <div className="parameter-item"></div>
      <hr style={{ margin: '10px 0' }} />

      <div className="parameter-item">
        <label style={{ fontWeight: 'bold' }}>Training Split (%):</label>
        <input
          type="number"
          value={datasetSplit.train}
          onChange={(e) =>
            setDatasetSplit((prev) => ({
              ...prev,
              train: e.target.value,
            }))
          }
          style={{ width: '80px', marginLeft: '10px' }}
        />
      </div>
      <hr style={{ margin: '10px 0' }} />
      <div className="parameter-item">
        <label style={{ fontWeight: 'bold' }}>Test Split (%):</label>
        <input
          type="number"
          value={datasetSplit.test}
          onChange={(e) =>
            setDatasetSplit((prev) => ({
              ...prev,
              test: e.target.value,
            }))
          }
          style={{ width: '80px', marginLeft: '10px' }}
        />
      </div>
      <hr style={{ margin: '10px 0' }} />
      <div className="parameter-item">
        <label style={{ fontWeight: 'bold' }}>Validation Split (%):</label>
        <input
          type="number"
          value={datasetSplit.validation}
          onChange={(e) =>
            setDatasetSplit((prev) => ({
              ...prev,
              validation: e.target.value,
            }))
          }
          style={{ width: '80px', marginLeft: '10px' }}
        />
      </div>
    </div>
  );
};
