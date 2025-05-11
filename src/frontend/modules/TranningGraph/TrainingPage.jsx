import React, { useEffect, useState } from 'react';
import TrainingGraphs from './TrainingGraphs';

const TrainingPage = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [modelInfo, setModelInfo] = useState({
    name: '',
    framework: '',
    layers: 0,
  });

  //   useEffect(() => {
  //     // Listen for training updates from the main process
  //     window.electron.ipcRenderer.on('training-update', (data) => {
  //       setTrainingData(prevData => [...prevData, data]);
  //     });

  //     window.electron.ipcRenderer.on('training-started', (info) => {
  //       setIsTraining(true);
  //       setModelInfo({
  //         name: info.modelName || 'MyModel',
  //         framework: info.framework || 'PyTorch',
  //         layers: info.layerCount || 0
  //       });
  //       // Reset training data when starting a new training session
  //       setTrainingData([]);
  //     });

  //     window.electron.ipcRenderer.on('training-completed', () => {
  //       setIsTraining(false);
  //     });

  //     // Clean up event listeners
  //     return () => {
  //       window.electron.ipcRenderer.removeAllListeners('training-update');
  //       window.electron.ipcRenderer.removeAllListeners('training-started');
  //       window.electron.ipcRenderer.removeAllListeners('training-completed');
  //     };
  //   }, []);

  return (
    <div className="training-page">
      <div className="header">
        <div className="title">
          <h1>Model Training</h1>
        </div>
        <div className="model-info">
          <p>
            <strong>Model:</strong> {modelInfo.name}
          </p>
          <p>
            <strong>Framework:</strong> {modelInfo.framework}
          </p>
          <p>
            <strong>Layers:</strong> {modelInfo.layers}
          </p>
        </div>
      </div>

      <div className="graphs-wrapper">
        <TrainingGraphs trainingData={trainingData} isTraining={isTraining} />
      </div>

      <div className="actions">
        <button
          className="stop-button"
          disabled={!isTraining}
          onClick={() =>
            window.electron.ipcRenderer.sendMessage('stop-training')
          }
        >
          Stop Training
        </button>
        <button
          className="close-button"
          disabled={isTraining}
          onClick={() => window.close()}
        >
          Close
        </button>
      </div>

      <style jsx>{`
        .training-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background-color: #f5f5f5;
          overflow: hidden;
        }

        .header {
          padding: 10px 20px;
          background-color: #2c3e50;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          min-height: 60px;
          max-height: 70px;
        }

        .title h1 {
          margin: 0;
          font-size: 1.5rem;

          @media (max-width: 768px) {
            font-size: 1.2rem;
          }
        }

        .model-info {
          display: flex;
          gap: 20px;
          font-size: 0.9rem;

          @media (max-width: 768px) {
            gap: 10px;
            flex-direction: column;
            font-size: 0.8rem;
          }
        }

        .model-info p {
          margin: 0;
        }

        .graphs-wrapper {
          flex: 1;
          width: 100%;
          display: flex;
          overflow: hidden;
        }

        .actions {
          padding: 10px 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
          width: 100%;
          background-color: #f0f0f0;
          border-top: 1px solid #ddd;
        }

        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
          font-size: 0.9rem;
        }

        .stop-button {
          background-color: #e74c3c;
          color: white;
        }

        .stop-button:hover {
          background-color: #c0392b;
        }

        .stop-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .close-button {
          background-color: #3498db;
          color: white;
        }

        .close-button:hover {
          background-color: #2980b9;
        }

        .close-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        @media (max-height: 600px) {
          .header {
            min-height: 50px;
            padding: 5px 15px;
          }

          .actions {
            padding: 5px 15px;
          }

          button {
            padding: 6px 12px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TrainingPage;
