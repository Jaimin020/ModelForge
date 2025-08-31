import React, { useEffect, useState } from 'react';
import { getNodeFeatureMap } from '../utils/nodeOps/nodeFetMap';
import { ModelNodeManager } from '../utils/graphMngr/ModelNodeManager.ts';
import { PYTORCH_NODE_PATH } from '../../envPath';
import './ParameterViewer.css';

export const ParameterViewer = ({ selectedNode, height }) => {
  const [nodeParams, setNodeParams] = useState({});
  const [tempValues, setTempValues] = useState({});
  const nodeManager = ModelNodeManager.getInstance();

  const handleParameterChange = (paramName, value) => {
    setTempValues({
      ...tempValues,
      [paramName]: value,
    });
  };

  const handleUpdateParameter = (paramName) => {
    if (selectedNode && tempValues[paramName] !== undefined) {
      // Convert boolean values to string 'True'/'False' if paramName is 'id'
      let valueToUpdate = tempValues[paramName];
      if (paramName === 'bias') {
        if (valueToUpdate === true) {
          valueToUpdate = 'True';
        } else if (valueToUpdate === false) {
          valueToUpdate = 'False';
        }
      }

      nodeManager.updateNodeParameter(
        selectedNode.id,
        paramName,
        valueToUpdate,
      );
    }
  };

  const handleResetParameter = (paramName, paramType) => {
    // Set default values based on parameter type
    const defaultValue =
      paramType === 'int' ? 1 : paramType === 'bool' ? true : '';

    // Update the temp value
    setTempValues({
      ...tempValues,
      [paramName]: defaultValue,
    });

    // Also update the actual node parameter
    if (selectedNode) {
      nodeManager.updateNodeParameter(selectedNode.id, paramName, defaultValue);
    }
  };

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const fetMap = await getNodeFeatureMap(PYTORCH_NODE_PATH);
        setNodeParams(fetMap);
      } catch (error) {
        console.error('Failed to load node feature map:', error);
        setNodeParams(new Map()); // Set empty Map on error
      }
    };
    loadNodes();
  }, []);

  useEffect(() => {
    // Reset temp values when selected node changes
    if (selectedNode && selectedNode.id) {
      const nodeConfig = nodeManager.getNode(selectedNode.id);
      if (nodeConfig && nodeConfig.parameters) {
        const initialValues = {};
        nodeConfig.parameters.forEach((param) => {
          initialValues[param.name] = param.value;
        });
        setTempValues(initialValues);
      }
    } else {
      setTempValues({});
    }
  }, [selectedNode]);

  const renderParameters = () => {
    if (!selectedNode || !nodeParams.get || !nodeParams.get(selectedNode.label))
      return null;

    let nodeConfig;
    if (selectedNode.id) {
      nodeConfig = nodeManager.getNode(selectedNode.id);
    } else {
      nodeConfig = nodeParams.get(selectedNode.label);
    }

    const displayableParams =
      nodeConfig?.parameters?.filter((param) => param.display === true) || [];
    return (
      <>
        {displayableParams.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Parameters:</label>
            <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
            {displayableParams.map((param, index) => (
              <div key={index}>
                <div className="parameter-item">
                  <label>{param.name}</label>
                  {param.required && (
                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                  )}
                  {param.type === 'file' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span
                        style={{
                          fontWeight: 'bold',
                          fontSize: '13px',
                          maxWidth: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {param.value
                          ? param.value.split('/').pop()
                          : 'No file selected'}
                      </span>
                    </div>
                  ) : param.type === 'bool' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      <select
                        value={tempValues[param.name] ? 'True' : 'False'}
                        style={{ width: '100px' }}
                        onChange={(e) =>
                          handleParameterChange(
                            param.name,
                            e.target.value === 'True',
                          )
                        }
                      >
                        <option value="True">true</option>
                        <option value="False">false</option>
                      </select>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleUpdateParameter(param.name)}
                          style={{ fontSize: '10px', padding: '2px 5px' }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() =>
                            handleResetParameter(param.name, param.type)
                          }
                          style={{ fontSize: '10px', padding: '2px 5px' }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : param.type === 'int' ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="number"
                        value={
                          tempValues[param.name] !== undefined
                            ? tempValues[param.name]
                            : param.value || ''
                        }
                        required={param.required}
                        placeholder={param.required ? 'Required' : 'Optional'}
                        style={{ width: '100px' }}
                        onChange={(e) =>
                          handleParameterChange(
                            param.name,
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value) || 0,
                          )
                        }
                      />
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => handleUpdateParameter(param.name)}
                          style={{ fontSize: '10px', padding: '2px 5px' }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() =>
                            handleResetParameter(param.name, param.type)
                          }
                          style={{ fontSize: '10px', padding: '2px 5px' }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={
                        tempValues[param.name] !== undefined
                          ? tempValues[param.name]
                          : param.value || ''
                      }
                      required={param.required}
                      placeholder={param.required ? 'Required' : 'Optional'}
                      style={{ width: '100px' }}
                      onChange={(e) =>
                        handleParameterChange(param.name, e.target.value)
                      }
                    />
                  )}
                </div>
                {index < (nodeConfig?.parameters?.length || 0) - 1 && (
                  <hr
                    style={{ margin: '8px 0', borderTop: '1px solid #ddd' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="parameter-item">
          <label>Layer type:</label>
          <span>{nodeConfig?.feature || 'Unknown'}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Library:</label>
          <span>{nodeConfig?.library || 'Unknown'}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Code ID:</label>
          <span>{nodeConfig?.codeId || 'Unknown'}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

        <div className="parameter-item">
          <label>Generated Code:</label>
          <span style={{ fontSize: '11px', color: '#666' }}>
            {nodeConfig?.code || 'No code available'}
          </span>
        </div>
      </>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: '150px', // Minimum height for parameter viewer
        overflow: 'auto',
      }}
    >
      <div
        className="parameter-viewer"
        style={{
          height: height || '190px', // Use provided height or default
        }}
      >
        <div className="parameter-viewer-header">Parameter Viewer</div>
        <div className="parameter-viewer-content">
          {selectedNode ? (
            <div className="parameter-content">
              <div className="parameter-item">
                <label>Layer Name:</label>
                <span>{selectedNode.label}</span>
              </div>
              <hr className="parameter-viewer-hr" />
              {renderParameters()}
            </div>
          ) : (
            <span>Select a layer to view parameters</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParameterViewer;
