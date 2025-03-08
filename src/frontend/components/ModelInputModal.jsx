import React, { useState } from 'react';
import { ModelNodeManager } from '../utils/graphMngr/ModelNodeManager.ts';
import { SpreadsheetOps } from "../utils/fileOpsUtils/SpreadsheetOps.ts";

export const ModelInputModal = ({ isOpen, onClose, selectedNode }) => {
  const [datasetSplit, setDatasetSplit] = useState({
    train: 80,
    test: 10,
    validation: 10
  });
  const [totalRows, setTotalRows] = useState(0);
  const [inputParams, setInputParams] = useState({
    File: selectedNode?.parameters?.['File'] || '',
    'Number of Features': selectedNode?.parameters?.['Number of Features'] || '',
    'Number of Predictor': selectedNode?.parameters?.['Number of Predictor'] || ''
  });
  const [columns, setColumns] = useState([]);

  const handleFileSelect = async () => {
    const filePath = await window.dialog.filePicker();
    if (filePath) {
      const spreadsheet = SpreadsheetOps.getInstance();
      const loaded = await spreadsheet.loadFile(filePath);
      if (loaded) {
        const stats = spreadsheet.getFileStats();
        const data = spreadsheet.getData();
        setTotalRows(stats.rowCount);
        setColumns(stats.columnNames);
        setInputParams(prev => ({
          ...prev,
          File: filePath,
          'Number of Features': stats.columnCount - 1,
          'Number of Predictor': 1
        }));
      }
    }
  };

  const handleSave = () => {
    const selectedFeatures = columns
      .filter((_, index) => document.getElementById(`feature-${index}`).checked)
      .map(col => col);
  
    const selectedPredictor = columns[
      columns.findIndex((_, index) => document.getElementById(`predictor-${index}`).checked)
    ];
  
    const updatedNode =[
        {
          name: 'File',
          value: inputParams.File
        },
        {
          name: 'Number of Features',
          value: selectedFeatures.length
        },
        {
          name: 'Number of Predictor',
          value: selectedPredictor.length
        },
        {
          name: 'Selected Feature',
          value: selectedFeatures
        },
        {
          name: 'Selected Predictor',
          value: selectedPredictor
        },
        {
          name: 'Train Split',
          value: datasetSplit.train
        },
        {
          name: 'Test Split',
          value: datasetSplit.test
        },
        {
          name: 'Validation Split',
          value: datasetSplit.validation
        }
      ]
    // Update the node with new parameters
    const nodeManager = ModelNodeManager.getInstance();
    nodeManager.updateMultipleNodeParameters(selectedNode.id, updatedNode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '0px',
        width: '800px',
        maxHeight: '90vh'
      }}>
        <div style={{
          fontSize: '14px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '8px 12px',
          borderBottom: '2px solid #34495e',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34z"/>
          </svg>
          Model Input Configuration
        </div>

        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '0px',
          fontSize: '12px',
          margin: '5px'
        }}>
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

              <div style={{ display: 'flex', marginTop: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Features Selection</div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {columns.map((column, index) => (
                      <div key={index} style={{ margin: '5px 0' }}>
                        <input
                          type="checkbox"
                          id={`feature-${index}`}
                          defaultChecked={index !== columns.length - 1}
                        />
                        <label htmlFor={`feature-${index}`}>{column}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Predictor Selection</div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {columns.map((column, index) => (
                      <div key={index} style={{ margin: '5px 0' }}>
                        <input
                          type="radio"
                          name="predictor"
                          id={`predictor-${index}`}
                          defaultChecked={index === columns.length - 1}
                        />
                        <label htmlFor={`predictor-${index}`}>{column}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Total Rows [Examples]: {totalRows}</label>
              </div>
              <hr style={{ margin: '10px 0' }} />
              
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Training Split (%):</label>
                <input
                  type="number"
                  value={datasetSplit.train}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, train: e.target.value }))}
                  style={{ width: '80px', marginLeft: '10px' }}
                />
              </div>
              <hr style={{ margin: '10px 0' }} />
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Test Split (%):</label>
                <input
                  type="number"
                  value={datasetSplit.test}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, test: e.target.value }))}
                  style={{ width: '80px', marginLeft: '10px' }}
                />
              </div>
              <hr style={{ margin: '10px 0' }} />
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Validation Split (%):</label>
                <input
                  type="number"
                  value={datasetSplit.validation}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, validation: e.target.value }))}
                  style={{ width: '80px', marginLeft: '10px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            borderTop: '1px solid #ddd',
            paddingTop: '10px'
            }}>
            <button
                onClick={onClose}
                style={{
                padding: '6px 16px',
                fontSize: '13px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                cursor: 'pointer'
                }}
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                style={{
                padding: '6px 16px',
                fontSize: '13px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
                }}
            >
                Save
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInputModal;
