import React, { useState } from 'react';
import ModelInputModal from './ModelInputModal';

export const Toolbar = ({ onRun, onStop, isRunning, showInputConfig, onInputConfig }) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const toolbarStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid lightgray',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    margin: '0 4px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  };

  const runButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#005eb8',
    color: 'white',
    '&:hover': {
      backgroundColor: '#004080',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
  };

  const stopButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#003366',
    color: 'white',
    '&:hover': {
      backgroundColor: '#002040',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
  };

  const configButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#45a049',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
  };

  return (
    <div style={toolbarStyle}>
      <button
        style={runButtonStyle}
        onClick={onRun}
        disabled={isRunning}
        title="Train"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#004080';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#005eb8';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2v12l10-6L4 2z" />
        </svg>
        {isRunning ? 'Training...' : 'Train'}
      </button>
      <button
        style={stopButtonStyle}
        onClick={onStop}
        title="Stop"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#002040';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#003366';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" />
        </svg>
        Stop
      </button>

      {showInputConfig && (
        <button
          style={configButtonStyle}
          onClick={onInputConfig}
          title="Configure Input"
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Configure Input
        </button>
      )}
    </div>
  );
};

export default Toolbar;
