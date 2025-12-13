import React from 'react';
import PropTypes from 'prop-types';
import './InferencePanel.css';

const CopilotPanel = ({ width }) => {
  return (
    <div className="inference-container" style={{ width: `${width}px` }}>
      <div className="inference-panel">
        <div className="inference-header">AI Assistant</div>

        <div className="inference-body">
          <div className="inference-input-area">
            {/* <div className="inference-section-header">Prompt</div>

            <div className="file-input-row">
              <input type="file" disabled />
              <div className="file-info">File input disabled</div>
            </div>

            <div className="or-divider">OR</div> */}

            <textarea
              placeholder="Ask for help with your model..."
              className="inference-textarea"
              disabled
            />

            <div className="inference-actions">
              <button className="start-inference-btn" disabled>
                Coming Soon
              </button>
            </div>

            <div className="inference-error">This feature is coming soon.</div>
          </div>

          <div className="inference-result">
            <div className="inference-section-header">Assistant Output</div>
            <pre className="result-pre">Coming Soon</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

CopilotPanel.propTypes = {
  width: PropTypes.number.isRequired,
};

export default CopilotPanel;
