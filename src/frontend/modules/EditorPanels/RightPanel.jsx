import NetworkCanvas from './NetworkCanvas';
import DiagnosticViewer from '../../components/DiagnosticViewer.jsx';

const RightPanel = ({ networkRef, handleDrop, output, setOutput }) => {
  return (
    <div className="right-panel">
      <NetworkCanvas networkRef={networkRef} handleDrop={handleDrop} />
      <DiagnosticViewer output={output} clearOutput={() => setOutput([])} />
    </div>
  );
};

export default RightPanel;
