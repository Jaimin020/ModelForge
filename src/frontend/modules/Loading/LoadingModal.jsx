import React from 'react';
import './style.css';

export function LoadingOverlay({
  isVisible,
  message = 'Processing...',
  title = 'ModelForge',
  version = '',
  logs = [],
  status = 'running',
  variant = 'default',
  onClose,
}) {
  if (!isVisible) return null;

  if (variant === 'startup') {
    return (
      <div className="loading-overlay loading-overlay-startup">
        <div className="loading-backdrop" />
        <div className="startup-loading-container" role="dialog" aria-modal="true">
          <div className="startup-loading-titlebar">
            <div>
              <div className="startup-loading-title">{title}</div>
              <div className="startup-loading-version">Version {version}</div>
            </div>
            <div className={`startup-loading-status startup-loading-status-${status}`}>
              {status}
            </div>
          </div>

          <div className="startup-loading-body">
            <div className="startup-spinner" aria-hidden="true">
              <div className="startup-spinner-ring" />
            </div>
            <div className="startup-loading-message">{message}</div>
            <div className="startup-loading-log-panel">
              {logs.map((log, index) => (
                <div key={`${log}-${index}`} className="startup-loading-log-line">
                  {log}
                </div>
              ))}
            </div>
            {status === 'error' && (
              <div className="startup-loading-actions">
                <button
                  type="button"
                  className="startup-loading-close-button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;
