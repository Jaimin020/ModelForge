import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './InferencePanel.css';

const InferencePanel = ({ width }) => {
  const [inferenceResult, setInferenceResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleStartInference = async () => {
    setError(null);
    setIsRunning(true);
    setInferenceResult(null);

    try {
      // Placeholder: Form the payload for inference.
      // In production this would call the backend / IPC to perform inference.
      // Example (placeholder):
      // const formData = new FormData();
      // if (selectedFile) formData.append('file', selectedFile);
      // else formData.append('text', inputText);
      // const res = await fetch('/api/inference', { method: 'POST', body: formData });
      // const json = await res.json();
      // setInferenceResult(json);

      // For now set a fake placeholder result so UI shows something.

      //Check for ONNX model setup
      const setupResult = await window.backend.setupModelForInference(selectedFile);
      if (setupResult && !setupResult.isValid) {
        setError(setupResult.error || 'Invalid ONNX model');
        setIsRunning(false);
        return;
      }

      await new Promise((r) => setTimeout(r, 700));
      setInferenceResult({
        status: 'placeholder',
        message: selectedFile
          ? `Would send file: ${selectedFile.name}`
          : 'Would send text input',
        // add structure that backend should return here
      });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="inference-container" style={{ width: `${width}px` }}>
      <div className="inference-panel">
        <div className="inference-header">Model Inference</div>

        <div className="inference-body">
          <div className="inference-input-area">
            <div className="inference-section-header">Input Data</div>

            <div className="file-input-row">
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileChange}
                data-testid="inference-file-input"
              />
              <div className="file-info">
                {selectedFile
                  ? selectedFile.name
                  : 'No file selected (optional)'}
              </div>
            </div>

            {/* <div className="or-divider">OR</div>

            <textarea
              placeholder="Or paste tabular input (CSV rows) here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="inference-textarea"
            /> */}

            <div className="inference-actions">
              <button
                className="start-inference-btn"
                onClick={handleStartInference}
                disabled={isRunning}
              >
                {isRunning ? 'Running…' : 'Start Inference'}
              </button>
            </div>

            {error && <div className="inference-error">Error: {error}</div>}
          </div>

          {inferenceResult && (
            <div className="inference-result">
              <div className="inference-section-header">Results</div>
              <pre className="result-pre">
                {JSON.stringify(inferenceResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

InferencePanel.propTypes = {
  width: PropTypes.number.isRequired,
};

export default InferencePanel;
