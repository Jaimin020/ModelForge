import React, { useState } from 'react';

export const Toolbar = ({
  onRun,
  onStop,
  isRunning,
  showInputConfig,
  onInputConfig,
  onHyperParam,
  onSave,
  onOpen,
}) => {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  // Function to handle training button click
  const handleTrainClick = () => {
    // Get the graph data
    const graphDataManager = GraphDataManager.getInstance();
    const graphData = graphDataManager.getGraphDataAsJson();

    // Open a new window with the TrainingPage
    const trainingWindow = window.open('', '_blank', 'width=1000,height=800');

    // Pass the graph data to the new window
    if (trainingWindow) {
      trainingWindow.graphData = graphData;

      // Load the TrainingPage in the new window
      trainingWindow.location.href = '/#/training';

      // Call the original onRun handler if provided
      if (onRun) {
        onRun(graphData);
      }
    }
  };

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

  const dividerStyle = {
    height: '24px',
    width: '1px',
    backgroundColor: '#d0d0d0',
    margin: '0 8px',
  };

  const openButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#FF9800',
    color: 'white',
    '&:hover': {
      backgroundColor: '#e68a00',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2196F3',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0b7dda',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
  };

  const runButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#4CAF50',
    color: 'white',
    '&:hover': {
      backgroundColor: '#45a049',
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
    backgroundColor: '#F44336',
    color: 'white',
    '&:hover': {
      backgroundColor: '#d32f2f',
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
        style={openButtonStyle}
        onClick={onOpen}
        title="Open Model"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#e68a00';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#FF9800';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8.5 10.5a.5.5 0 0 0-1 0v1.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 12.293v-1.793z" />
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
          <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
        </svg>
        Open
      </button>

      <button
        style={saveButtonStyle}
        onClick={onSave}
        title="Save Model"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0b7dda';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
        </svg>
        Save
      </button>
      {/* First vertical divider */}
      <div style={dividerStyle}></div>

      <button
        style={runButtonStyle}
        onClick={onRun}
        disabled={isRunning}
        title="Train"
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
          <path d="M4 2v12l10-6L4 2z" />
        </svg>
        {isRunning ? 'Training...' : 'Train'}
      </button>
      <button
        style={stopButtonStyle}
        onClick={onStop}
        title="Stop"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#d32f2f';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#F44336';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" />
        </svg>
        Stop
      </button>

      <div style={dividerStyle}></div>

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
