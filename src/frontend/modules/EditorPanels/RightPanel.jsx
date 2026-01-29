import NetworkCanvas from './NetworkCanvas';
import DiagnosticViewer from '../../components/DiagnosticViewer.jsx';
import GraphToolbar from '../../components/GraphToolbar.jsx';

const RightPanel = ({ networkRef, handleDrop, output, setOutput, networkInstance }) => {
  
  const showError = (message) => {
    console.error(message);
    // Add to diagnostic viewer
    if (setOutput) {
      setOutput(prev => [...prev, { 
        type: 'error', 
        message: message 
      }]);
    }
  };

  const handleAddEdge = () => {
    if (!networkInstance?.current) {
      showError('Network not initialized');
      return;
    }
    
    try {
      const selection = networkInstance.current.getSelection();
      if (!selection.nodes || selection.nodes.length === 0) {
        showError('Please select at least one node to start adding edges');
        return;
      }
      networkInstance.current.addEdgeMode();
    } catch (error) {
      showError(`Failed to enter edge mode: ${error.message}`);
    }
  };

  const handleEditEdge = () => {
    if (!networkInstance?.current) {
      showError('Network not initialized');
      return;
    }
    
    try {
      const selection = networkInstance.current.getSelection();
      if (!selection.edges || selection.edges.length === 0) {
        showError('Please select an edge to edit');
        return;
      }
      networkInstance.current.editEdgeMode();
    } catch (error) {
      showError(`Failed to enter edit mode: ${error.message}`);
    }
  };

  const handleDelete = () => {
    if (!networkInstance?.current) {
      showError('Network not initialized');
      return;
    }
    
    try {
      const selection = networkInstance.current.getSelection();
      if ((!selection.nodes || selection.nodes.length === 0) && 
          (!selection.edges || selection.edges.length === 0)) {
        showError('Please select a node or edge to delete');
        return;
      }
      networkInstance.current.deleteSelected();
    } catch (error) {
      showError(`Failed to delete: ${error.message}`);
    }
  };

  const handleBack = () => {
    if (!networkInstance?.current) {
      showError('Network not initialized');
      return;
    }
    
    try {
      networkInstance.current.disableEditMode();
    } catch (error) {
      showError(`Failed to cancel: ${error.message}`);
    }
  };

  return (
    <div className="right-panel">
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <GraphToolbar 
          onAddEdge={handleAddEdge}
          onEditEdge={handleEditEdge}
          onDelete={handleDelete}
          onBack={handleBack}
          isEditMode={true}
        />
        <NetworkCanvas networkRef={networkRef} handleDrop={handleDrop} />
      </div>
      <DiagnosticViewer output={output} clearOutput={() => setOutput([])} />
    </div>
  );
};

export default RightPanel;
