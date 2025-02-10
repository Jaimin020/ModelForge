import React, { useEffect, useState } from 'react';
import { getNodeFeatureMap } from '../utils/nodeOps/nodeFetMap';

export const ParameterViewer = ({ selectedNode }) => {
  const [nodeParams, setNodeParams] = useState({});

  useEffect(() => {
    const loadNodes = async () => {
        const fetMap = await getNodeFeatureMap('/Users/jaiminchauhan/Projects/Git/ModelForge/src/frontend/utils/pyTorchNodes.xml');
        setNodeParams(fetMap);
    }
    loadNodes();
  }, []);

  const renderParameters = () => {
    if (!selectedNode || !nodeParams.get(selectedNode.label)) return null;

    const nodeConfig = nodeParams.get(selectedNode.label);

    return (
      <>
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
          <span style={{fontSize: '11px', color: '#666'}}>{nodeConfig.code}</span>
        </div>
        <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
        
        <div style={{marginTop: '10px'}}>
          <label style={{fontWeight: 'bold'}}>Parameters:</label>
          {nodeConfig.parameters.map((param, index) => (
            <div key={index}>
              <div className="parameter-item">
                <label>{param.name}:</label>
                {param.type === 'bool' ? (
                  <select 
                    defaultValue={param.default || 'false'} 
                    style={{width: '100px'}}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input 
                    type={param.type === 'int' ? 'number' : 'text'}
                    defaultValue={param.default || ''}
                    required={param.required === 'true'}
                    placeholder={param.required === 'true' ? 'Required' : 'Optional'}
                    style={{width: '100px'}}
                  />
                )}
                {param.required === 'true' && 
                  <span style={{color: 'red', marginLeft: '5px'}}>*</span>
                }
              </div>
              {index < nodeConfig.parameters.length - 1 && (
                <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

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
