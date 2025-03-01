import React, { useState } from 'react';
import { ModelNodeManager } from '../utils/graphMngr/ModelNodeManager.ts';

export const ModelInputModal = ({ isOpen, onClose, selectedNode }) => {
  const [datasetSplit, setDatasetSplit] = useState({
    train: '',
    test: '',
    validation: ''
  });
  const [totalRows, setTotalRows] = useState(0);
  const [inputParams, setInputParams] = useState({
    File: selectedNode?.parameters?.File || '',
    'Number of Features': selectedNode?.parameters?.['Number of Features'] || '',
    'Number of Predictor': selectedNode?.parameters?.['Number of Predictor'] || ''
  });

  const handleFileSelect = async () => {
    const filePath = await window.dialog.filePicker();
    if (filePath) {
      setInputParams(prev => ({
        ...prev,
        File: filePath
      }));
    }
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
        padding: '20px',
        borderRadius: '4px',
        width: '800px',
        maxHeight: '90vh', // Prevent modal from being too tall
        display: 'flex',
        flexDirection: 'column',
    }}>
        {/* Parameters Section */}
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Input Parameters</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="parameter-item">
              <label style={{ fontWeight: 'bold' }}>File:</label>
              <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                <input
                  type="text"
                  value={inputParams.File}
                  readOnly
                  placeholder="Select file..."
                  style={{ width: '200px', padding: '5px' }}
                />
                <button onClick={handleFileSelect} style={{ padding: '5px 10px' }}>
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div style={{ display: 'flex', 
            flex: 1,
            minHeight: 0 // Important for flex containe 
        }}>
          {/* Left Section - Feature Selection */}
          <div style={{ flex: 1, 
            borderRight: '1px solid #ddd', 
            padding: '10px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
              fontSize: '14px',
              backgroundColor: 'white',
              padding: '5px',
              borderBottom: '1px solid #ddd',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Features Selection
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              border: '1px solid #ddd',
              flex: 1,
              overflowY: 'auto'
            }}>
              {Array(10).fill(0).map((_, index) => (
                <div key={index} className="parameter-item" style={{ margin: '8px 0' }}>
                  <input 
                    type="checkbox" 
                    id={`feature-${index}`}
                    style={{ marginRight: '8px' }}
                    defaultChecked={index < 9}
                  />
                  <label htmlFor={`feature-${index}`}>Feature {index + 1}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Middle Section - Predictor Selection */}
            <div style={{ 
                flex: 1, 
                borderRight: '1px solid #ddd',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                fontSize: '14px',
                backgroundColor: 'white',
                padding: '5px',
                borderBottom: '1px solid #ddd',
                marginBottom: '10px',
                fontWeight: 'bold'
                }}>
                Predictor Selection
                </div>
                <div style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                border: '1px solid #ddd',
                flex: 1,
                overflowY: 'auto'
                }}>
                {Array(10).fill(0).map((_, index) => (
                    <div key={index} className="parameter-item" style={{ margin: '8px 0' }}>
                    <input 
                        type="checkbox" 
                        id={`predictor-${index}`}
                        style={{ marginRight: '8px' }}
                        defaultChecked={index === 9}
                    />
                    <label htmlFor={`predictor-${index}`}>Column {index + 1}</label>
                    </div>
                ))}
                </div>
            </div>

          {/* Right Section - Dataset Split */}
          <div style={{ flex: 1, 
            padding: '10px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              fontSize: '14px',
              backgroundColor: 'white',
              padding: '5px',
              borderBottom: '1px solid #ddd',
              marginBottom: '10px',
              fontWeight: 'bold'
            }}>
              Dataset Configuration
            </div>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              border: '1px solid #ddd',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div className="parameter-item" style={{ margin: '15px 0' }}>
                <label style={{ fontWeight: 'bold' }}>Total Rows:</label>
                <span>{totalRows}</span>
              </div>
              <hr style={{ margin: '15px 0', borderTop: '1px solid #ddd' }} />
              
              <div className="parameter-item" style={{ margin: '15px 0' }}>
                <label style={{ fontWeight: 'bold' }}>Training Split (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={datasetSplit.train}
                  style={{ width: '150px', padding: '5px', marginLeft: '10px' }}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, train: e.target.value }))}
                />
              </div>

              <div className="parameter-item" style={{ margin: '15px 0' }}>
                <label style={{ fontWeight: 'bold' }}>Test Split (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={datasetSplit.test}
                  style={{ width: '150px', padding: '5px', marginLeft: '10px' }}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, test: e.target.value }))}
                />
              </div>

              <div className="parameter-item" style={{ margin: '15px 0' }}>
                <label style={{ fontWeight: 'bold' }}>Validation Split (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={datasetSplit.validation}
                  style={{ width: '150px', padding: '5px', marginLeft: '10px' }}
                  onChange={(e) => setDatasetSplit(prev => ({ ...prev, validation: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div style={{ marginTop: '20px', 
        textAlign: 'right',
        paddingTop: '10px',
        borderTop: '1px solid #ddd'
        }}>
          <button 
            onClick={onClose}
            style={{
              padding: '8px 20px',
              marginRight: '10px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd'
            }}
          >
            Cancel
          </button>
          <button 
            style={{
              padding: '8px 20px',
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
  );
};

export default ModelInputModal;
