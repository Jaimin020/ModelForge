import React from 'react';
import PropTypes from 'prop-types';

const RightStripe = ({ activePane, onPaneChange }) => {
  const buttonStyle = (isActive) => ({
    width: '100%',
    height: '120px',
    padding: '10px 0',
    border: 'none',
    background: isActive ? '#e0e0e0' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      background: '#f0f0f0',
    },
  });

  const textStyle = {
    writingMode: 'vertical-lr',
    textOrientation: 'mixed',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
    fontWeight: 800,
    color: '#666',
    marginTop: '8px',
  };

  const iconStyle = {
    fontSize: '18px',
    color: '#444',
  };

  return (
    <div
      className="right-stripe"
      style={{
        width: '30px',
        backgroundColor: '#f5f5f5',
        borderLeft: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '12px',
      }}
    >
      <style>
        {`
          .stripe-button {
            position: relative;
          }
          .stripe-button::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background-color: #007acc;
            transform: scaleY(0);
            transition: transform 0.2s ease;
          }
          .stripe-button:hover::before {
            transform: scaleY(1);
          }
          .stripe-button.active::before {
            transform: scaleY(1);
            background-color: #007acc;
          }
          .stripe-button:hover {
            background-color: #f0f0f0;
          }
          .stripe-button.active {
            background-color: #e0e0e0;
          }
        `}
      </style>
      <button
        className={`stripe-button ${activePane === 'inference' ? 'active' : ''}`}
        onClick={() => onPaneChange('inference')}
        style={buttonStyle(activePane === 'inference')}
        title="Model Inference"
      >
        <i className="fas fa-brain" style={iconStyle}></i>
        <span style={textStyle}>Inference</span>
      </button>
      <button
        className={`stripe-button ${activePane === 'copilot' ? 'active' : ''}`}
        onClick={() => onPaneChange('copilot')}
        style={buttonStyle(activePane === 'copilot')}
        title="AI Assistant"
      >
        <i className="fas fa-robot" style={iconStyle}></i>
        <span style={textStyle}>Copilot</span>
      </button>
    </div>
  );
};

RightStripe.propTypes = {
  activePane: PropTypes.string,
  onPaneChange: PropTypes.func.isRequired,
};

export default RightStripe;
