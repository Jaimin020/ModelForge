import React from 'react';
import './style.css';

export const FooterLine = ({ isRunning = true, framework = 'PyTorch' }) => {
  return (
    <div className="framework-footer">
      <div className="framework-info">
        {/* Loader at leftmost end */}
        <div className="loading-container-footer">
          {isRunning ? (
            <div className="lds-facebook">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : (
            <span className="status-text">Ready</span>
          )}
        </div>

        {/* Framework name at rightmost end */}
        <span className="framework-name">{framework}</span>
      </div>
    </div>
  );
};

export default FooterLine;
