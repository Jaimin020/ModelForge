import React, { useEffect, useState } from 'react';
import { SpreadsheetOps } from '../../utils/fileOpsUtils/SpreadsheetOps';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager';

export function TabularInputConfig({ onSaveReady, selectedNode }) {
  const [inputParams, setInputParams] = useState({
    File: '',
    'Number of Features': '',
    'Number of Predictor': '',
  });
  const [columns, setColumns] = useState([]);
  const [totalRows, setTotalRows] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());
  const [selectedPredictor, setSelectedPredictor] = useState(null);

  // Initialize selections when columns are loaded
  useEffect(() => {
    if (columns.length > 0) {
      // Default: select all columns except last as features
      const defaultFeatures = new Set(
        columns.slice(0, -1).map((_, index) => index),
      );
      setSelectedFeatures(defaultFeatures);
      // Default: select last column as predictor
      setSelectedPredictor(columns.length - 1);
    }
  }, [columns]);

  const handleSave = () => {
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
