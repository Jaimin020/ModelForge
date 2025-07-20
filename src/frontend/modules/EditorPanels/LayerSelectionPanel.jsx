import React, { useEffect, useState } from 'react';
import { getNodeNames } from '../../utils/nodeOps/nodeName';
import { PYTORCH_NODE_PATH } from '../../../envPath';
import '../Workspace/style.css';

import './LayerSelectionPanel.css';

const LayerSelectionPanel = ({ onDragStart, layerSelectionHeight }) => {
  const [nodeNames, setNodeNames] = useState([]);

  useEffect(() => {
    const loadNodes = async () => {
      const names = await getNodeNames(PYTORCH_NODE_PATH);
      setNodeNames(names);
    };
    loadNodes();
  }, []);

  return (
    <div
      className="layer-selection-container"
      style={{
        height: `${layerSelectionHeight}px`,
      }}
    >
      <div className="layer-selection-panel">
        <div className="layer-selection-header">Layer Selection Panel</div>
        <div className="layer-selection-list">
          <div className="parameter-list">
            {nodeNames.map((nodeName, index) => (
              <div key={index} className="parameter-item">
                <div
                  className="shape"
                  draggable="true"
                  data-shape={nodeName}
                  onDragStart={onDragStart}
                >
                  {nodeName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSelectionPanel;
