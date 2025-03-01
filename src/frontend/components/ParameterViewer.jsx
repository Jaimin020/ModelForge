import React, { useEffect, useState } from 'react';
import { getNodeFeatureMap } from '../utils/nodeOps/nodeFetMap';
import { ModelNodeManager } from '../utils/graphMngr/ModelNodeManager.ts';

export const ParameterViewer = ({ selectedNode }) => {
  const [nodeParams, setNodeParams] = useState({});
  const nodeManager = ModelNodeManager.getInstance();

  const handleParameterChange = (paramName, value) => {
    if (selectedNode) {
      nodeManager.updateNodeParameter(selectedNode.id, paramName, value);
    }
  };

  useEffect(() => {
    const loadNodes = async () => {
      const fetMap = await getNodeFeatureMap(
        '/Users/jaiminchauhan/Projects/Git/ModelForge/src/frontend/utils/pyTorchNodes.xml',
      );
      setNodeParams(fetMap);
    };
    loadNodes();
  }, []);

  const renderParameters = () => {
    if (!selectedNode || !nodeParams.get(selectedNode.label)) return null;

    var nodeConfig;
    if (selectedNode.id) {
      nodeConfig = nodeManager.getNode(selectedNode.id);
    } else {
      nodeConfig = nodeParams.get(selectedNode.label);
    }

    return (
      <>
        <div style={{ marginTop: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>Parameters:</label>
          <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
          {nodeConfig.parameters.map((param, index) => (
            <div key={index}>
              <div className="parameter-item">
                <label>{param.name}:</label>
                {param.type === 'file' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input
                        type="text"
                        value={param.value || ''}
                        readOnly
                        placeholder="Select file..."
                        style={{ width: '100px' }}
                      />
                      <button
                        onClick={async () => {
                          const filePath = await window.dialog.filePicker();
                          if (filePath) {
                            handleParameterChange(param.name, filePath);
                            setNodeParams(new Map(nodeParams));
                          }
                        }}
                        style={{
                          padding: '2px 8px',
                          fontSize: '11px'
                        }}
                      >
                        Browse
                      </button>
                    </div>
                  ) :param.type === 'bool' ? (
                  <select
                    value={param.value}
                    style={{ width: '100px' }}
                    onChange={(e) =>
                      handleParameterChange(
                        param.name,
                        e.target.value === 'true',
                      )
                    }
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    type={param.type === 'int' ? 'number' : 'text'}
                    value={param.value}
                    required={param.required === 'true'}
                    placeholder={
                      param.required === 'true' ? 'Required' : 'Optional'
                    }
                    style={{ width: '100px' }}
                    onChange={(e) =>
                      handleParameterChange(
                        param.name,
                        param.type === 'int'
                          ? parseInt(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                )}
                {param.required === 'true' && (
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                )}
              </div>
              {index < nodeConfig.parameters.length - 1 && (
                <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
              )}
            </div>
          ))}
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
        <div className="parameter-item">
          <label>Layer type:</label>
          <span>{nodeConfig.feature}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Library:</label>
          <span>{nodeConfig.library}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Code ID:</label>
          <span>{nodeConfig.codeId}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Generated Code:</label>
          <span style={{ fontSize: '11px', color: '#666' }}>
            {nodeConfig.code}
          </span>
        </div>
      </>
    );
  };

  return (
    <div
      className="parameter-viewer"
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
          backgroundColor: 'white',
          padding: '3px',
          borderBottom: '1px solid #ddd',
          marginBottom: '3px',
        }}
      >
        Parameter Viewer
      </div>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '0px',
          height: '190px',
          overflowY: 'scroll',
          fontSize: '12px',
        }}
      >
        {selectedNode ? (
          <div className="parameter-content">
            <div className="parameter-item">
              <label>Layer Name:</label>
              <span>{selectedNode.label}</span>
            </div>
            <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
            {renderParameters()}
          </div>
        ) : (
          <span>Select a layer to view parameters</span>
        )}
      </div>
    </div>
  );
};

export default ParameterViewer;
