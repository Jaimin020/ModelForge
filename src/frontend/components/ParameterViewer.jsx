import React from 'react';

export const ParameterViewer = ({ selectedNode }) => {
  return (
    <div className="parameter-viewer" style={{ border: '1px solid #ccc', borderRadius: '0px', padding: '5px', margin: '5px' }}>
      <div style={{ 
        fontSize: '12px', 
        backgroundColor: 'white',
        padding: '3px',
        borderBottom: '1px solid #ddd',
        marginBottom: '3px'
      }}>
        Parameter Viewer
      </div>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '0px',
        height: '190px',
        overflowY: 'scroll',
        fontSize: '12px'
      }}>
        {selectedNode ? (
          <div className="parameter-content">
            <div className="parameter-item">
              <label>Layer Type:</label>
              <span>{selectedNode.label}</span>
            </div>
            {selectedNode.label === "Fully Connected" && (
              <>
                <div className="parameter-item">
                  <label>Units:</label>
                  <input type="number" defaultValue={64} min={1} style={{width: '100px'}} />
                </div>
                <div className="parameter-item">
                  <label>Activation:</label>
                  <select defaultValue="relu" style={{width: '100px'}}>
                    <option value="relu">ReLU</option>
                    <option value="sigmoid">Sigmoid</option>
                    <option value="tanh">Tanh</option>
                  </select>
                </div>
              </>
            )}
            {selectedNode.label === "Input Layer" && (
              <div className="parameter-item">
                <label>Input Shape:</label>
                <input type="text" placeholder="e.g., 28,28,1" style={{width: '100px'}} />
              </div>
            )}
          </div>
        ) : (
          <span>Select a layer to view parameters</span>
        )}
      </div>
    </div>
  );
};

export default ParameterViewer;
