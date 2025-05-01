import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrainingGraphs = ({ trainingData, isTraining=false }) => {
  const [epochs, setEpochs] = useState([]);
  const [trainLoss, setTrainLoss] = useState([]);
  const [trainAccuracy, setTrainAccuracy] = useState([]);
  const [testLoss, setTestLoss] = useState([]);
  const [testAccuracy, setTestAccuracy] = useState([]);

  useEffect(() => {
    if (trainingData && trainingData.length > 0) {
      setEpochs(trainingData.map(data => data.epoch));
      setTrainLoss(trainingData.map(data => data.trainLoss));
      setTrainAccuracy(trainingData.map(data => data.trainAccuracy));
      setTestLoss(trainingData.map(data => data.testLoss));
      setTestAccuracy(trainingData.map(data => data.testAccuracy));
    }
  }, [trainingData]);

  const lossOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Training and Test Loss',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    animation: {
      duration: isTraining ? 0 : 1000, // Disable animation during training for performance
    },
  };

  const accuracyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Training and Test Accuracy',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
    animation: {
      duration: isTraining ? 0 : 1000, // Disable animation during training for performance
    },
  };

  const lossData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Loss',
        data: trainLoss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Test Loss',
        data: testLoss,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const accuracyData = {
    labels: epochs,
    datasets: [
      {
        label: 'Training Accuracy',
        data: trainAccuracy,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Test Accuracy',
        data: testAccuracy,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  return (
    <div className="training-graphs-container">
      <div className="graph-container">
        <Line options={lossOptions} data={lossData} />
      </div>
      <div className="graph-container">
        <Line options={accuracyOptions} data={accuracyData} />
      </div>
      
      {isTraining && (
        <div className="training-status">
          <p>Training in progress... Epoch: {epochs.length > 0 ? epochs[epochs.length - 1] : 0}</p>
        </div>
      )}
      
      <style jsx>{`
        .training-graphs-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          width: 100%;
          height: auto;
          overflow: auto;
        }
        
        .graph-container {
          height: 300px;
          max-height: 350px;
          width: 100%;
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .training-status {
          text-align: center;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
          font-weight: bold;
          width: 100%;
        }

        @media (max-height: 800px) {
          .graph-container {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default TrainingGraphs;
