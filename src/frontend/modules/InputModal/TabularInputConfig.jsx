import React, { useEffect, useState } from 'react';
import { SpreadsheetOps } from '../../utils/fileOpsUtils/SpreadsheetOps';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export function TabularInputConfig({ onSaveReady, selectedNode, properties }) {
  const [inputParams, setInputParams] = useState({
    File: properties?.File || '',
    'Number of Features': properties?.['Number of Features'] || '',
    'Number of Predictor': properties?.['Number of Predictor'] || '',
  });
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());
  const [selectedPredictor, setSelectedPredictor] = useState(null);

  const restoreFileConfiguration = async () => {
    const nodeManager = ModelNodeManager.getInstance();
    const nodePrams = nodeManager.getNode(selectedNode?.id);
    const filePath = nodePrams?.parameters?.find(
      (p) => p.name === 'File',
    )?.value;
    if (filePath && filePath.trim() !== '') {
      try {
        const spreadsheet = SpreadsheetOps.getInstance();
        const loaded = await spreadsheet.loadFile(filePath);
        if (loaded) {
          const stats = spreadsheet.getFileStats();
          setTotalRows(stats.rowCount);
          setColumns(stats.columnNames);

          // Restore selected features if available
          const savedFeatures = properties?.['Selected Feature'];
          if (savedFeatures && Array.isArray(savedFeatures)) {
            const featureIndices = new Set();
            savedFeatures.forEach((featureName) => {
              const index = stats.columnNames.indexOf(featureName);
              if (index !== -1) {
                featureIndices.add(index);
              }
            });
            setSelectedFeatures(featureIndices);
          }

          // Restore selected predictor if available
          const savedPredictor = properties?.['Selected Predictor'];
          if (savedPredictor) {
            const predictorIndex = stats.columnNames.indexOf(savedPredictor);
            if (predictorIndex !== -1) {
              setSelectedPredictor(predictorIndex);
            }
          }
        }
      } catch (error) {
        console.error('Error restoring tabular file configuration:', error);
      }
    }
  };

  // Restore file configuration if file is already selected
  useEffect(() => {
    restoreFileConfiguration();
  }, []);

  // Initialize selections when columns are loaded (only if no saved configuration)
  useEffect(() => {
    if (columns.length > 0) {
      // Only set defaults if no saved configuration exists
      const savedFeatures = properties?.['Selected Feature'];
      const savedPredictor = properties?.['Selected Predictor'];

      if (!savedFeatures || savedFeatures.length === 0) {
        // Default: select all columns except last as features
        const defaultFeatures = new Set(
          columns.slice(0, -1).map((_, index) => index),
        );
        setSelectedFeatures(defaultFeatures);
      }

      if (!savedPredictor) {
        // Default: select last column as predictor
        setSelectedPredictor(columns.length - 1);
      }
    }
  }, [columns, selectedNode]);

  const handleSave = async () => {
    const selectedFeatureNames = Array.from(selectedFeatures).map(
      (index) => columns[index],
    );
    const selectedPredictorName =
      selectedPredictor !== null ? columns[selectedPredictor] : null;

    if (selectedFeatureNames.length === 0) {
      console.error('No features selected');
      return;
    }

    if (!selectedPredictorName) {
      console.error('No predictor selected');
      return;
    }

    const updatedNode = [
      {
        name: 'File',
        value: inputParams.File,
      },
      {
        name: 'Number of Features',
        value: selectedFeatureNames.length,
      },
      {
        name: 'Number of Predictor',
        value: 1,
      },
      {
        name: 'Selected Feature',
        value: selectedFeatureNames,
      },
      {
        name: 'Selected Predictor',
        value: selectedPredictorName,
      },
    ];

    await restoreFileConfiguration();
    const nodeManager = ModelNodeManager.getInstance();
    nodeManager.updateMultipleNodeParameters(selectedNode.id, updatedNode);
  };

  // Register the save handler with parent
  useEffect(() => {
    if (onSaveReady) {
      onSaveReady('textInput', handleSave);
    }
  }, [onSaveReady, selectedFeatures, selectedPredictor, inputParams, columns]);

  const handleFileSelect = async () => {
    const filePath = await window.dialog.filePicker(['csv', 'xlsx'], false);
    if (filePath) {
      const spreadsheet = SpreadsheetOps.getInstance();
      const loaded = await spreadsheet.loadFile(filePath);
      if (loaded) {
        const stats = spreadsheet.getFileStats();
        const data = spreadsheet.getData();
        setTotalRows(stats.rowCount);
        setColumns(stats.columnNames);
        setInputParams((prev) => ({
          ...prev,
          File: filePath,
          'Number of Features': stats.columnCount - 1,
          'Number of Predictor': 1,
        }));
      }
    }
  };

  const handleFeatureChange = (index, checked) => {
    const newSelected = new Set(selectedFeatures);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedFeatures(newSelected);
  };

  const handlePredictorChange = (index) => {
    setSelectedPredictor(index);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <div className="parameter-item">
          <label style={{ fontWeight: 'bold' }}>File:</label>
          <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
            <input
              type="text"
              value={inputParams.File}
              readOnly
              placeholder="Select file..."
              style={{ flex: 1, padding: '5px' }}
            />
            <button onClick={handleFileSelect} style={{ padding: '5px 10px' }}>
              Browse
            </button>
          </div>
        </div>
        {totalRows > 0 && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Total rows: {totalRows}
          </div>
        )}
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Features Selection
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {columns.map((column, index) => (
                <div key={index} style={{ margin: '5px 0' }}>
                  <input
                    type="checkbox"
                    id={`feature-${index}`}
                    checked={selectedFeatures.has(index)}
                    onChange={(e) =>
                      handleFeatureChange(index, e.target.checked)
                    }
                  />
                  <label htmlFor={`feature-${index}`}>{column}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Predictor Selection
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {columns.map((column, index) => (
                <div key={index} style={{ margin: '5px 0' }}>
                  <input
                    type="radio"
                    name="predictor"
                    id={`predictor-${index}`}
                    checked={selectedPredictor === index}
                    onChange={() => handlePredictorChange(index)}
                  />
                  <label htmlFor={`predictor-${index}`}>{column}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
