import React, { useEffect, useState } from 'react';
import { getNodeNames } from '../../utils/nodeOps/nodeName';
import { PYTORCH_NODE_PATH } from '../../../envPath';
import '../Workspace/style.css';

export const LayerSelectionPanel = ({ onDragStart }) => {
  const [nodeNames, setNodeNames] = useState([]);

  useEffect(() => {
    const loadNodes = async () => {
      const names = await getNodeNames(PYTORCH_NODE_PATH);
      setNodeNames(names);
    };
    loadNodes();
  }, []);

  const shapeStyle = {
    padding: '8px',
    marginBottom: '5px',
    border: '1px solid #468dee',
    backgroundColor: '#97c2fc',
    cursor: 'grab',
    borderRadius: '0px',
    width: '100%',
  };

  return (
    <div
      className="layer-selection-panel"
      style={{
        border: '1px solid #ccc',
        borderRadius: '0px',
        padding: '5px',
        margin: '5px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          padding: '3px',
          borderBottom: '1px solid #ddd',
          marginBottom: '3px',
        }}
      >
        Layer Selection Panel
      </div>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '0px',
          height: '450px',
          overflowY: 'scroll',
          fontSize: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {nodeNames.map((nodeName, index) => (
            <div key={index} className="parameter-item">
              <div
                className="shape"
                draggable="true"
                data-shape={nodeName}
                onDragStart={onDragStart}
                style={shapeStyle}
              >
                {nodeName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayerSelectionPanel;
