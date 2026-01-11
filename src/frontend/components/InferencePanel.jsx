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
      // Call backend to setup model and get metrics
      const metrics = await window.backend.setupModelForInference(
        selectedFile ? selectedFile.path : '',
      );
      setInferenceResult(metrics);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleExportCSV = () => {
    if (!inferenceResult || !inferenceResult.csv) return;
    const blob = new Blob([inferenceResult.csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inference_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              {inferenceResult && (
                <button className="export-csv-btn" onClick={handleExportCSV}>
                  Export Results
                </button>
              )}
            </div>

            {error && <div className="inference-error">Error: {error}</div>}
          </div>

          {inferenceResult && (
            <div className="inference-result">
              <div className="inference-section-header">
                Model Performance Metrics
              </div>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">MAE</div>
                  <div className="metric-value">{inferenceResult.mae}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">MSE</div>
                  <div className="metric-value">{inferenceResult.mse}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">RMSE</div>
                  <div className="metric-value">{inferenceResult.rmse}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">R²</div>
                  <div className="metric-value">{inferenceResult.r2}</div>
                </div>
              </div>
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
