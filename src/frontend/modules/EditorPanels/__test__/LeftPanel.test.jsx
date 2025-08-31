import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeftPanel from '../LeftPanel';

// Mock child components
jest.mock('../LayerSelectionPanel.jsx', () => {
  return function MockLayerSelectionPanel({ layerSelectionHeight }) {
    return (
      <div 
        data-testid="layer-selection-panel" 
        style={{ height: `${layerSelectionHeight}px` }}
      >
        Layer Selection Panel
      </div>
    );
  };
});

jest.mock('../../../components/ParameterViewer.jsx', () => ({
  ParameterViewer: function MockParameterViewer({ height }) {
    return (
      <div 
        data-testid="parameter-viewer" 
        style={{ height }}
      >
        Parameter Viewer
      </div>
    );
  },
}));

jest.mock('../../Footer/FooterLine.jsx', () => ({
  FooterLine: function MockFooterLine() {
    return <div data-testid="footer-line">Footer Line</div>;
  },
}));

describe('LeftPanel Integration Tests', () => {
  const defaultProps = {
    leftPanelWidth: 300,
    selectedNode: null,
    isRunning: false,
    activeFramework: 'pytorch',
    draggedShapeRef: { current: null },
  };

  beforeEach(() => {
    // Mock window.innerHeight for resize calculations
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Resizing behavior', () => {
    it('should update LayerSelectionPanel height when vertical divider is dragged', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const layerSelectionPanel = getByTestId('layer-selection-panel');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // Initial height should be 300px (default)
      expect(layerSelectionPanel).toHaveStyle('height: 300px');
      
      // Start dragging the horizontal divider
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      
      // Simulate mouse move down by 50px
      fireEvent.mouseMove(document, { clientY: 450 });
      
      // LayerSelectionPanel height should increase by 50px
      expect(layerSelectionPanel).toHaveStyle('height: 350px');
      
      // End drag
      fireEvent.mouseUp(document);
    });

    it('should maintain minimum height constraints during resize', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const layerSelectionPanel = getByTestId('layer-selection-panel');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // Start dragging from initial position
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      
      // Try to drag up beyond minimum height - drag to position that would result in height < 150px
      // Math.max(100, Math.min(300 + (50 - 400), 800 - 200)) = Math.max(100, Math.min(-50, 600)) = Math.max(100, -50) = 100
      // But 100 < 150 (minHeight), so height should remain unchanged at 300
      fireEvent.mouseMove(document, { clientY: 50 }); 
      
      // Height should remain unchanged since new calculated height would be below minimum
      expect(layerSelectionPanel).toHaveStyle('height: 300px');
      
      fireEvent.mouseUp(document);
    });

    it('should maintain maximum height constraints during resize', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const layerSelectionPanel = getByTestId('layer-selection-panel');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // Start dragging from initial position
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      
      // Try to drag down beyond maximum height - drag to position that would exceed maxHeight (450px)
      // Math.max(100, Math.min(300 + (800 - 400), 800 - 200)) = Math.max(100, Math.min(700, 600)) = Math.max(100, 600) = 600
      // But 600 > 450 (maxHeight), so height should remain unchanged at 300
      fireEvent.mouseMove(document, { clientY: 800 }); 
      
      // Height should remain unchanged since new calculated height would exceed maximum
      expect(layerSelectionPanel).toHaveStyle('height: 300px');
      
      fireEvent.mouseUp(document);
    });

    it('should allocate remaining space to ParameterViewer when LayerSelectionPanel is resized', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const parameterViewer = getByTestId('parameter-viewer');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // ParameterViewer should have 100% height initially to take remaining space
      expect(parameterViewer).toHaveStyle('height: 100%');
      
      // Resize LayerSelectionPanel
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      fireEvent.mouseMove(document, { clientY: 500 }); // Increase LayerSelectionPanel height
      fireEvent.mouseUp(document);
      
      // ParameterViewer should still have 100% height to take remaining space
      // (the flex layout will automatically adjust the available space)
      expect(parameterViewer).toHaveStyle('height: 100%');
    });

    it('should stop resizing when mouse is released', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const layerSelectionPanel = getByTestId('layer-selection-panel');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // Start dragging
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      fireEvent.mouseMove(document, { clientY: 450 });
      
      expect(layerSelectionPanel).toHaveStyle('height: 350px');
      
      // Release mouse
      fireEvent.mouseUp(document);
      
      // Further mouse movements should not affect height
      fireEvent.mouseMove(document, { clientY: 500 });
      expect(layerSelectionPanel).toHaveStyle('height: 350px'); // Should remain the same
    });

    it('should handle multiple resize sessions correctly', () => {
      const { getByTestId, container } = render(<LeftPanel {...defaultProps} />);
      
      const layerSelectionPanel = getByTestId('layer-selection-panel');
      const horizontalDivider = container.querySelector('.horizontal-divider');
      
      // First resize session
      fireEvent.mouseDown(horizontalDivider, { clientY: 400 });
      fireEvent.mouseMove(document, { clientY: 450 });
      fireEvent.mouseUp(document);
      
      expect(layerSelectionPanel).toHaveStyle('height: 350px');
      
      // Second resize session starting from new position
      fireEvent.mouseDown(horizontalDivider, { clientY: 450 });
      fireEvent.mouseMove(document, { clientY: 400 }); // Move up by 50px
      fireEvent.mouseUp(document);
      
      expect(layerSelectionPanel).toHaveStyle('height: 300px');
    });
  });
});
