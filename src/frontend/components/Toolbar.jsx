import React, { useState } from 'react';
import ModelInputModal from './ModelInputModal';

export const Toolbar = ({
  onRun,
  onStop,
  isRunning,
  showInputConfig,
  onInputConfig,
  onHyperParam,
}) => {
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

  const hyperParamButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9C27B0',
    color: 'white',
    '&:hover': {
      backgroundColor: '#7B1FA2',
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

      <button
        style={hyperParamButtonStyle}
        onClick={onHyperParam}
        title="Configure Hyperparameters"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#7B1FA2';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#9C27B0';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
        </svg>
        Hyperparameters
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
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          Configure Input
        </button>
      )}
    </div>
  );
};

export default Toolbar;
