import React, { useState } from "react";

export const DiagnosticViewer = ({ scriptPath }) => {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const executePythonScript = async () => {
    setOutput(""); 
    setIsRunning(true);

    try {
      const result = await window.api.runPython(scriptPath);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="diagnostic-viewer" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px', margin: '5px' }}>
      <div style={{ 
        fontSize: '12px', 
        backgroundColor: '#f5f5f5',
        padding: '3px',
        borderBottom: '1px solid #ddd',
        marginBottom: '3px'
      }}>
        Diagnostic Viewer
      </div>
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          height: '150px',
          overflowY: 'scroll',
          fontSize: '12px'
        }}
      >
        {output || "No output yet..."}
      </pre>
    </div>
  );
};

export default DiagnosticViewer;
