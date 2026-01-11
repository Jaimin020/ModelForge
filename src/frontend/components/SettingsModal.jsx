import React, { useState, useEffect } from 'react';
import SettingsManager from '../utils/SettingsManager';
import PythonPathDetector from '../utils/PythonPathDetector';
import { ModalTemplate } from './ModalTemplate';

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

      // Auto-validate the saved Python path
      if (currentSettings.pythonPath) {
        validatePythonPath(currentSettings.pythonPath);
      } else {
        // Clear validation state if no path is set
        setPythonValidation({
          isValid: false,
          isChecking: false,
          message: '',
          version: '',
        });
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

    // Clear validation message when user is typing
    setPythonValidation({
      isValid: false,
      isChecking: false,
      message: '',
      version: '',
    });
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

  const title = 'Settings Configuration';

  const body = (
    <div>
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
                  fontStyle: pythonValidation.isChecking ? 'italic' : 'normal',
                }}
              >
                {pythonValidation.message}
              </div>
            )}
          </div>
          <button
            onClick={() => validatePythonPath(settings.pythonPath)}
            disabled={!settings.pythonPath || pythonValidation.isChecking}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              backgroundColor:
                !settings.pythonPath || pythonValidation.isChecking
                  ? '#ccc'
                  : '#2196F3',
              color: 'white',
              border: 'none',
              cursor:
                !settings.pythonPath || pythonValidation.isChecking
                  ? 'not-allowed'
                  : 'pointer',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              marginTop: '0px',
            }}
          >
            {pythonValidation.isChecking ? 'Checking...' : 'Validate'}
          </button>
          <button
            onClick={handleAutoDetect}
            disabled={isDetecting}
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              backgroundColor: isDetecting ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: isDetecting ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              marginTop: '0px',
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
        <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
          Select GPU acceleration option (placeholder - implementation coming
          soon)
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
        <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
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
    </div>
  );

  const footer = (
    <>
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
        disabled={!pythonValidation.isValid || pythonValidation.isChecking}
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
    </>
  );

  return <ModalTemplate title={title} body={body} footer={footer} />;
}

export default SettingsModal;
