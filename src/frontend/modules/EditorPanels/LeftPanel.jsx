import React, { useState } from 'react';
import LayerSelectionPanel from './LayerSelectionPanel.jsx';
import { ParameterViewer } from '../../components/ParameterViewer.jsx';
import { FooterLine } from '../Footer/FooterLine.jsx';

const LeftPanel = ({
  leftPanelWidth,
  selectedNode,
  isRunning,
  activeFramework,
  draggedShapeRef,
}) => {
  const [layerSelectionHeight, setLayerSelectionHeight] = useState(300);

  const handleDragStart = (e) => {
    draggedShapeRef.current = e.target.getAttribute('data-shape');
  };

  const handleVerticalDividerMouseDown = (e) => {
    const startY = e.clientY;
    const startHeight = layerSelectionHeight;

    const minHeight = 150; // Minimum height for layer selection
    const maxHeight = window.innerHeight - 350; // Maximum height, leaving space for parameter viewer

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(
        100,
        Math.min(startHeight + deltaY, window.innerHeight - 200),
      );
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setLayerSelectionHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
    <div
      className="left-panel"
      style={{
        width: `${leftPanelWidth}px`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <LayerSelectionPanel
        onDragStart={handleDragStart}
        layerSelectionHeight={layerSelectionHeight}
      />

      <div
        className="horizontal-divider"
        onMouseDown={handleVerticalDividerMouseDown}
        style={{ cursor: 'row-resize' }}
      />

      <ParameterViewer selectedNode={selectedNode} height="100%" />
      <FooterLine isRunning={isRunning} framework={activeFramework} />
    </div>
  );
};

export default LeftPanel;
