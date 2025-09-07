import React, { useState } from 'react';
import {
  FolderOpen,
  Save,
  FileOutput,
  BrushCleaning,
  Play,
  Square,
  Settings,
  Sliders,
} from 'lucide-react';
import './styles/Toolbar.css';

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

  return (
    <div className="toolbar">
      <button className="btn btn-open" onClick={onOpen} title="Open Model">
        <FolderOpen size={16} />
        Open
      </button>

      <button className="btn btn-save" onClick={onSave} title="Save Model">
        <Save size={16} />
        Save
      </button>

      <button className="btn btn-save" onClick={onSaveAs} title="Save As">
        <FileOutput size={16} />
        Save As
      </button>

      <button className="btn btn-clear" onClick={onClear} title="Clear Model">
        <BrushCleaning size={16} />
        Clear
      </button>

      <div className="divider" />

      <button
        className="btn btn-run"
        onClick={onRun}
        disabled={isRunning}
        title="Train"
      >
        <Play size={16} />
        {isRunning ? 'Training...' : 'Train'}
      </button>

      <button className="btn btn-stop" onClick={onStop} title="Stop">
        <Square size={16} />
        Stop
      </button>

      <div className="divider" />

      <button
        className="btn btn-hyper"
        onClick={onHyperParam}
        title="Configure Hyperparameters"
      >
        <Sliders size={16} />
        Hyperparameters
      </button>

      {showInputConfig && (
        <button
          className="btn btn-config"
          onClick={onInputConfig}
          title="Configure Input"
        >
          <Settings size={16} />
          Configure Input
        </button>
      )}
    </div>
  );
}

export default Toolbar;
