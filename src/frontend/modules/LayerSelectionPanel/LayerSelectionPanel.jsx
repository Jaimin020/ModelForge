import React from 'react';
import "../Workspace/style.css";

export const LayerSelectionPanel = ({ onDragStart }) => {
  const shapeStyle = {
    padding: '8px',
    marginBottom: '5px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'grab',
    borderRadius: '0px',
    width: '100%' // Make items take full width
  };

  return (
    <div className="layer-selection-panel" style={{ border: '1px solid #ccc', borderRadius: '0px', padding: '5px', margin: '5px' }}>
      <div style={{ 
        fontSize: '12px', 
        padding: '3px',
        borderBottom: '1px solid #ddd',
        marginBottom: '3px'
      }}>
        Layer Selection Panel
      </div>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '0px',
        height: '450px',
        overflowY: 'scroll',
        fontSize: '12px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div className="parameter-item">
            <div
              className="shape"
              draggable="true"
              data-shape="Input Layer"
              onDragStart={onDragStart}
              style={shapeStyle}
            >
              Input Layer
            </div>
          </div>
          <div className="parameter-item">
            <div
              className="shape"
              draggable="true"
              data-shape="Fully Connected"
              onDragStart={onDragStart}
              style={shapeStyle}
            >
              FC
            </div>
          </div>
          <div className="parameter-item">
            <div
              className="shape"
              draggable="true"
              data-shape="Loss Function"
              onDragStart={onDragStart}
              style={shapeStyle}
            >
              Loss Function
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSelectionPanel;
