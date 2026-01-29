import React, { useState } from 'react';
import { BrushCleaning } from 'lucide-react';

export function Toolbar({
  onRun,
  onStop,
  isRunning,
  showInputConfig,
  onInputConfig,
  onHyperParam,
  onSave,
  onSaveAs,
  onOpen,
  onClear,
  onSettings,
}) {
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
    padding: '6px 8px',
    backgroundColor: '#1e1e1e',
    borderBottom: '1px solid #2d2d30',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  };

  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    margin: '0 3px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    outline: 'none',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#2d2d30',
    color: '#cccccc',
    whiteSpace: 'nowrap',
  };

  const buttonHoverStyle = {
    backgroundColor: '#3e3e42',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#0e639c',
    color: '#ffffff',
  };

  const primaryButtonHoverStyle = {
    backgroundColor: '#1177bb',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(14, 99, 156, 0.4)',
  };

  const destructiveButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#5a1f1f',
    color: '#ff6b6b',
  };

  const destructiveButtonHoverStyle = {
    backgroundColor: '#6b2929',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(255, 107, 107, 0.3)',
    color: '#ff8787',
  };

  const criticalButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#b71c1c',
    color: '#ffffff',
  };

  const criticalButtonHoverStyle = {
    backgroundColor: '#c62828',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(183, 28, 28, 0.5)',
  };

  const dividerStyle = {
    height: '24px',
    width: '1px',
    backgroundColor: '#3e3e42',
    margin: '0 8px',
  };

  const handleMouseEnter = (e, hoverStyle) => {
    Object.assign(e.currentTarget.style, hoverStyle);
  };

  const handleMouseLeave = (e, baseStyle) => {
    Object.assign(e.currentTarget.style, baseStyle);
  };

  return (
    <div style={toolbarStyle}>
      {/* Left side buttons */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          style={buttonBaseStyle}
          onClick={onOpen}
          title="Open Model"
          onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.5 10.5a.5.5 0 0 0-1 0v1.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 12.293v-1.793z" />
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
            <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
          </svg>
          Open
        </button>

        <button
          style={primaryButtonStyle}
          onClick={onSave}
          title="Save Model"
          onMouseEnter={(e) => handleMouseEnter(e, primaryButtonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, primaryButtonStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
          </svg>
          Save
        </button>

        <button
          style={primaryButtonStyle}
          onClick={onSaveAs}
          title="Save Model As"
          onMouseEnter={(e) => handleMouseEnter(e, primaryButtonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, primaryButtonStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
          </svg>
          Save As
        </button>

        <button
          style={destructiveButtonStyle}
          onClick={onClear}
          title="Clear Model"
          onMouseEnter={(e) => handleMouseEnter(e, destructiveButtonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, destructiveButtonStyle)}
        >
          <BrushCleaning
            style={{ marginRight: '3px', position: 'relative', top: '1px' }}
            size={16}
          />
          Clear
        </button>

        {/* First vertical divider */}
        <div style={dividerStyle} />

        <button
          style={primaryButtonStyle}
          onClick={onRun}
          disabled={isRunning}
          title="Train Model"
          onMouseEnter={(e) => handleMouseEnter(e, primaryButtonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, primaryButtonStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2v12l10-6L4 2z" />
          </svg>
          {isRunning ? 'Training...' : 'Train'}
        </button>
        <button
          style={criticalButtonStyle}
          onClick={onStop}
          title="Stop Training"
          onMouseEnter={(e) => handleMouseEnter(e, criticalButtonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, criticalButtonStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="3" width="10" height="10" />
          </svg>
          Stop
        </button>

        <div style={dividerStyle} />

        <button
          style={buttonBaseStyle}
          onClick={onHyperParam}
          title="Configure Hyperparameters"
          onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
          onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
          Hyperparameters
        </button>

        {showInputConfig && (
          <button
            style={buttonBaseStyle}
            onClick={onInputConfig}
            title="Configure Input"
            onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
            onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
            Configure Input
          </button>
        )}
      </div>

      {/* Spacer to push settings button to right */}
      <div style={{ flex: 1 }} />

      {/* Right side settings button */}
      <button
        style={buttonBaseStyle}
        onClick={onSettings}
        title="Settings"
        onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
        onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
        </svg>
        Settings
      </button>
    </div>
  );
}

export default Toolbar;
