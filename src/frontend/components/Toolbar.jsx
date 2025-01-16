import React from "react";

export const Toolbar = ({ onRun, onStop }) => {
  const buttonStyle = {
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    outline: "none",
  };

  const runButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "white",
  };

  const stopButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    color: "white",
  };

  const toolbarStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderBottom: "1px solid #ccc",
  };

  return (
    <div style={toolbarStyle}>
      <button style={runButtonStyle} onClick={onRun}>
        Run
      </button>
      <button style={stopButtonStyle} onClick={onStop}>
        Stop
      </button>
    </div>
  );
};

export default Toolbar;