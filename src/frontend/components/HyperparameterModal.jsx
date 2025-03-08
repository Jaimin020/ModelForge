import React, { useState } from 'react';
import { GraphDataManager } from '../utils/graphUtils/GraphDataManager.ts';

export const HyperparameterModal = ({ isOpen, onClose }) => {
  const [hyperparameters, setHyperparameters] = useState({
    learning_rate: 0.001,
    epochs: 100,
    batch_size: 32,
    optimizer: 'adam',
    momentum: 0.9,
    weight_decay: 0.0001,
    dropout_rate: 0.2,
    early_stopping_patience: 5,
  });

  const optimizerOptions = ['adam', 'sgd', 'rmsprop', 'adagrad'];
  const graphManager = GraphDataManager.getInstance();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHyperparameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  const handleHyperParamSave = (params) => {
    // Handle the hyperparameters here
    graphManager.setHyperparameters(params);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '0px',
          width: '800px',
          maxHeight: '90vh',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '8px 12px',
            borderBottom: '2px solid #34495e',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34z" />
          </svg>
          Hyperparameter Configuration
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '0px',
            fontSize: '12px',
            margin: '5px',
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Learning Rate:</label>
                <input
                  type="number"
                  name="learning_rate"
                  value={hyperparameters.learning_rate}
                  onChange={handleInputChange}
                  step="0.0001"
                  min="0"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Epochs:</label>
                <input
                  type="number"
                  name="epochs"
                  value={hyperparameters.epochs}
                  onChange={handleInputChange}
                  min="1"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Batch Size:</label>
                <input
                  type="number"
                  name="batch_size"
                  value={hyperparameters.batch_size}
                  onChange={handleInputChange}
                  min="1"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Optimizer:</label>
                <select
                  name="optimizer"
                  value={hyperparameters.optimizer}
                  onChange={handleInputChange}
                  style={{ width: '100px' }}
                >
                  {optimizerOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Momentum:</label>
                <input
                  type="number"
                  name="momentum"
                  value={hyperparameters.momentum}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="1"
                  style={{ width: '100px' }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ flex: 1 }}>
              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Weight Decay:</label>
                <input
                  type="number"
                  name="weight_decay"
                  value={hyperparameters.weight_decay}
                  onChange={handleInputChange}
                  step="0.0001"
                  min="0"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>Dropout Rate:</label>
                <input
                  type="number"
                  name="dropout_rate"
                  value={hyperparameters.dropout_rate}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="1"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />

              <div className="parameter-item">
                <label style={{ fontWeight: 'bold' }}>
                  Early Stopping Patience:
                </label>
                <input
                  type="number"
                  name="early_stopping_patience"
                  value={hyperparameters.early_stopping_patience}
                  onChange={handleInputChange}
                  min="1"
                  style={{ width: '100px' }}
                />
              </div>
              <hr style={{ margin: '8px 0', borderTop: '1px solid #ddd' }} />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
              borderTop: '1px solid #ddd',
              paddingTop: '10px',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => handleHyperParamSave(hyperparameters)}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HyperparameterModal;
