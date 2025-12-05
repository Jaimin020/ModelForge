import React, { useState, useEffect } from 'react';
import SettingsManager from '../utils/SettingsManager';
import PythonPathDetector from '../utils/PythonPathDetector';

export function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    pythonPath: '',
    gpu: 'auto',
    environment: 'PyTorch',
  });

  const [pythonValidation, setPythonValidation] = useState({
    isValid: false,
    isChecking: false,
    message: '',
    version: '',
  });

  const [availablePythonPaths, setAvailablePythonPaths] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const settingsManager = SettingsManager.getInstance();
  const pythonDetector = PythonPathDetector.getInstance();

  // Load settings from manager on component mount
  useEffect(() => {
    if (isOpen) {
      const currentSettings = settingsManager.getSettings();
      setSettings(currentSettings);

      // Validate current Python path if it exists
      if (currentSettings.pythonPath) {
        validatePythonPath(currentSettings.pythonPath);
      }
    }
  }, [isOpen]);

  const validatePythonPath = async (path) => {
    if (!path) {
      setPythonValidation({
        isValid: false,
        isChecking: false,
        message: '',
        version: '',
      });
      return;
    }

    setPythonValidation((prev) => ({
      ...prev,
      isChecking: true,
      message: 'Checking...',
    }));

    try {
      const result = await pythonDetector.validatePythonPath(path);
      setPythonValidation({
        isValid: result.isValid,
        isChecking: false,
        message: result.error || result.warning || 'Valid Python installation',
        version: result.version || '',
      });
    } catch (error) {
      setPythonValidation({
        isValid: false,
        isChecking: false,
        message: 'Failed to validate Python path',
        version: '',
      });
    }
  };

  const handlePythonPathChange = (e) => {
    const newPath = e.target.value;
    setSettings((prev) => ({ ...prev, pythonPath: newPath }));

    // Validate after a short delay
    const timeoutId = setTimeout(() => {
      validatePythonPath(newPath);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      const paths = await pythonDetector.detectPythonPaths();
      setAvailablePythonPaths(paths);

      if (paths.length > 0) {
        // Auto-select the first valid path
        const bestPath = paths[0];
        setSettings((prev) => ({ ...prev, pythonPath: bestPath }));
        await validatePythonPath(bestPath);
      } else {
        setPythonValidation({
          isValid: false,
          isChecking: false,
          message:
            'No Python installations found. Please install Python 3.8 or higher.',
          version: '',
        });
      }
    } catch (error) {
      setPythonValidation({
        isValid: false,
        isChecking: false,
        message: 'Failed to detect Python installations',
        version: '',
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSettingsSave = () => {
    // Validate Python path before saving
    if (!settings.pythonPath) {
      setPythonValidation({
        isValid: false,
        isChecking: false,
        message: 'Please specify a Python path',
        version: '',
      });
      return;
    }

    if (!pythonValidation.isValid) {
      setPythonValidation({
        isValid: false,
        isChecking: false,
        message: 'Please fix Python path issues before saving',
        version: '',
      });
      return;
    }

    // Save settings
    settingsManager.updateSettings(settings);
    onClose();
  };

  const getValidationColor = () => {
    if (pythonValidation.isChecking) return '#FFA500';
    if (pythonValidation.isValid) return '#4CAF50';
    return '#F44336';
  };

  if (!isOpen) return null;

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
          width: '700px',
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
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
          Settings Configuration
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '0px',
            fontSize: '12px',
            margin: '5px',
          }}
        >
          {/* Python Path Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              1. Python Path
            </h4>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={settings.pythonPath}
                  onChange={handlePythonPathChange}
                  placeholder="Enter Python executable path (e.g., python3, /usr/bin/python3)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${getValidationColor()}`,
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                />
                {pythonValidation.version && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#666',
                      marginTop: '4px',
                    }}
                  >
                    Version: {pythonValidation.version}
                  </div>
                )}
                {pythonValidation.message && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: getValidationColor(),
                      marginTop: '4px',
                      fontStyle: pythonValidation.isChecking
                        ? 'italic'
                        : 'normal',
                    }}
                  >
                    {pythonValidation.message}
                  </div>
                )}
              </div>
              <button
                onClick={handleAutoDetect}
                disabled={isDetecting}
                style={{
                  padding: '8px 12px',
                  fontSize: '12px',
                  backgroundColor: isDetecting ? '#ccc' : '#2196F3',
                  color: 'white',
                  border: 'none',
                  cursor: isDetecting ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                {isDetecting ? 'Detecting...' : 'Find'}
              </button>
            </div>

            {availablePythonPaths.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#666',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Available Python installations:
                </label>
                <select
                  value={settings.pythonPath}
                  onChange={(e) => {
                    setSettings((prev) => ({
                      ...prev,
                      pythonPath: e.target.value,
                    }));
                    validatePythonPath(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  <option value="">Select a Python installation...</option>
                  {availablePythonPaths.map((path, index) => (
                    <option key={index} value={path}>
                      {path}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <hr style={{ margin: '15px 0', borderTop: '1px solid #ddd' }} />

          {/* GPU Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              2. GPU Configuration
            </h4>
            <div
              style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}
            >
              Select GPU acceleration option (placeholder - implementation
              coming soon)
            </div>
            <select
              value={settings.gpu}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, gpu: e.target.value }))
              }
              disabled
              style={{
                width: '200px',
                padding: '6px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: '#f9f9f9',
                cursor: 'not-allowed',
              }}
            >
              <option value="auto">Auto-detect</option>
              <option value="cpu">CPU Only</option>
              <option value="cuda">CUDA GPU</option>
              <option value="metal">Metal (Apple Silicon)</option>
            </select>
          </div>

          <hr style={{ margin: '15px 0', borderTop: '1px solid #ddd' }} />

          {/* Environment Section */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              3. ML Environment
            </h4>
            <div
              style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}
            >
              Choose your preferred ML framework (placeholder - implementation
              coming soon)
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'not-allowed',
                }}
              >
                <input
                  type="radio"
                  name="environment"
                  value="PyTorch"
                  checked={settings.environment === 'PyTorch'}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environment: e.target.value,
                    }))
                  }
                  disabled
                  style={{ marginRight: '6px' }}
                />
                <span style={{ fontSize: '12px' }}>PyTorch</span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'not-allowed',
                }}
              >
                <input
                  type="radio"
                  name="environment"
                  value="TensorFlow"
                  checked={settings.environment === 'TensorFlow'}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      environment: e.target.value,
                    }))
                  }
                  disabled
                  style={{ marginRight: '6px' }}
                />
                <span style={{ fontSize: '12px' }}>TensorFlow</span>
              </label>
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
              onClick={handleSettingsSave}
              disabled={
                !pythonValidation.isValid || pythonValidation.isChecking
              }
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                backgroundColor:
                  pythonValidation.isValid && !pythonValidation.isChecking
                    ? '#4CAF50'
                    : '#ccc',
                color: 'white',
                border: 'none',
                cursor:
                  pythonValidation.isValid && !pythonValidation.isChecking
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
