import React from "react";

export const Toolbar = ({ onRun, onStop ,isRunning }) => {
  const toolbarStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid lightgray",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    margin: "0 4px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  };

  const runButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#005eb8",
    color: "white",
    "&:hover": {
      backgroundColor: "#004080",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
  };

  const stopButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#003366",
    color: "white",
    "&:hover": {
      backgroundColor: "#002040",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
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
          e.currentTarget.style.backgroundColor = "#004080";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#005eb8";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2v12l10-6L4 2z"/>
        </svg>
        {isRunning ? 'Training...' : 'Train'}
      </button>
      <button 
        style={stopButtonStyle} 
        onClick={onStop}
        title="Stop"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#002040";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#003366";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10"/>
        </svg>
        Stop
      </button>
    </div>
  );
};

export default Toolbar;
