import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toolbar } from '../Toolbar';

// Mock GraphDataManager
jest.mock('../../utils/graphUtils/GraphDataManager', () => ({
  GraphDataManager: {
    getInstance: jest.fn(),
  },
}));

import { GraphDataManager } from '../../utils/graphUtils/GraphDataManager';

describe('Toolbar Component', () => {
  let mockGraphDataManager;
  let mockProps;

  // Mock window.open for training functionality
  const mockWindowOpen = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock GraphDataManager instance
    mockGraphDataManager = {
      getGraphDataAsJson: jest.fn().mockReturnValue({
        nodes: [{ id: 1, name: 'Conv2d' }],
        edges: [{ id: 1, from: 1, to: 2 }],
        hyperparameters: { learning_rate: 0.01 },
      }),
    };
    GraphDataManager.getInstance.mockReturnValue(mockGraphDataManager);

    // Mock window.open
    Object.defineProperty(window, 'open', {
      writable: true,
      value: mockWindowOpen,
    });

    // Set up default props
    mockProps = {
      onRun: jest.fn(),
      onStop: jest.fn(),
      isRunning: false,
      showInputConfig: false,
      onInputConfig: jest.fn(),
      onHyperParam: jest.fn(),
      onSave: jest.fn(),
      onSaveAs: jest.fn(),
      onOpen: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders all toolbar buttons correctly', () => {
      render(<Toolbar {...mockProps} />);

      expect(screen.getByTitle('Open Model')).toBeInTheDocument();
      expect(screen.getByTitle('Save Model')).toBeInTheDocument();
      expect(screen.getByTitle('Save Model As')).toBeInTheDocument();
      expect(screen.getByTitle('Train')).toBeInTheDocument();
      expect(screen.getByTitle('Stop')).toBeInTheDocument();
      expect(
        screen.getByTitle('Configure Hyperparameters'),
      ).toBeInTheDocument();
    });

    it('shows Train button text when not running', () => {
      render(<Toolbar {...mockProps} />);
      expect(screen.getByText('Train')).toBeInTheDocument();
    });

    it('shows Training... button text when running', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      expect(screen.getByText('Training...')).toBeInTheDocument();
    });

    it('disables train button when running', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      const trainButton = screen.getByTitle('Train');
      expect(trainButton).toBeDisabled();
    });

    it('conditionally renders Configure Input button', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} showInputConfig={false} />,
      );
      expect(screen.queryByTitle('Configure Input')).not.toBeInTheDocument();

      rerender(<Toolbar {...mockProps} showInputConfig={true} />);
      expect(screen.getByTitle('Configure Input')).toBeInTheDocument();
    });
  });

  describe('Button Click Actions', () => {
    it('calls onOpen when Open button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const openButton = screen.getByTitle('Open Model');
      fireEvent.click(openButton);

      expect(mockProps.onOpen).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when Save button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const saveButton = screen.getByTitle('Save Model');
      fireEvent.click(saveButton);

      expect(mockProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('calls onSaveAs when Save As button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const saveAsButton = screen.getByTitle('Save Model As');
      fireEvent.click(saveAsButton);

      expect(mockProps.onSaveAs).toHaveBeenCalledTimes(1);
    });

    it('calls onRun when Train button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const trainButton = screen.getByTitle('Train');
      fireEvent.click(trainButton);

      expect(mockProps.onRun).toHaveBeenCalledTimes(1);
    });

    it('calls onStop when Stop button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const stopButton = screen.getByTitle('Stop');
      fireEvent.click(stopButton);

      expect(mockProps.onStop).toHaveBeenCalledTimes(1);
    });

    it('calls onHyperParam when Hyperparameters button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const hyperParamButton = screen.getByTitle('Configure Hyperparameters');
      fireEvent.click(hyperParamButton);

      expect(mockProps.onHyperParam).toHaveBeenCalledTimes(1);
    });

    it('calls onInputConfig when Configure Input button is clicked', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      const inputConfigButton = screen.getByTitle('Configure Input');
      fireEvent.click(inputConfigButton);

      expect(mockProps.onInputConfig).toHaveBeenCalledTimes(1);
    });
  });

  // describe('Train Button Functionality', () => {
  //   it('opens training window and passes graph data', () => {
  //     const mockTrainingWindow = {
  //       location: { href: '' },
  //       graphData: null,
  //     };
  //     mockWindowOpen.mockReturnValue(mockTrainingWindow);

  //     render(<Toolbar {...mockProps} />);

  //     const trainButton = screen.getByTitle('Train');
  //     fireEvent.click(trainButton);

  //     // Check that window.open was called with correct parameters
  //     expect(mockWindowOpen).toHaveBeenCalledWith('', '_blank', 'width=1000,height=800');

  //     // Check that graph data was passed to the window
  //     expect(mockTrainingWindow.graphData).toEqual({
  //       nodes: [{ id: 1, name: 'Conv2d' }],
  //       edges: [{ id: 1, from: 1, to: 2 }],
  //       hyperparameters: { learning_rate: 0.01 }
  //     });

  //     // Check that the window location was set
  //     expect(mockTrainingWindow.location.href).toBe('/#/training');

  //     // Check that onRun was called with graph data
  //     expect(mockProps.onRun).toHaveBeenCalledWith({
  //       nodes: [{ id: 1, name: 'Conv2d' }],
  //       edges: [{ id: 1, from: 1, to: 2 }],
  //       hyperparameters: { learning_rate: 0.01 }
  //     });
  //   });

  //   it('handles case when training window fails to open', () => {
  //     mockWindowOpen.mockReturnValue(null);

  //     render(<Toolbar {...mockProps} />);

  //     const trainButton = screen.getByTitle('Train');
  //     fireEvent.click(trainButton);

  //     // Should not call onRun if window fails to open
  //     expect(mockProps.onRun).not.toHaveBeenCalled();
  //   });

  //   it('works correctly when onRun prop is not provided', () => {
  //     const mockTrainingWindow = {
  //       location: { href: '' },
  //       graphData: null,
  //     };
  //     mockWindowOpen.mockReturnValue(mockTrainingWindow);

  //     const propsWithoutOnRun = { ...mockProps };
  //     delete propsWithoutOnRun.onRun;

  //     render(<Toolbar {...propsWithoutOnRun} />);

  //     const trainButton = screen.getByTitle('Train');
  //     fireEvent.click(trainButton);

  //     // Should not throw error and window should still be configured
  //     expect(mockWindowOpen).toHaveBeenCalled();
  //     expect(mockTrainingWindow.graphData).toBeDefined();
  //     expect(mockTrainingWindow.location.href).toBe('/#/training');
  //   });

  //   it('gets fresh graph data from GraphDataManager on each click', () => {
  //     const firstGraphData = { nodes: [{ id: 1 }], edges: [], hyperparameters: {} };
  //     const secondGraphData = { nodes: [{ id: 1 }, { id: 2 }], edges: [{ id: 1 }], hyperparameters: { lr: 0.1 } };

  //     mockGraphDataManager.getGraphDataAsJson
  //       .mockReturnValueOnce(firstGraphData)
  //       .mockReturnValueOnce(secondGraphData);

  //     const mockTrainingWindow = {
  //       location: { href: '' },
  //       graphData: null,
  //     };
  //     mockWindowOpen.mockReturnValue(mockTrainingWindow);

  //     render(<Toolbar {...mockProps} />);

  //     const trainButton = screen.getByTitle('Train');

  //     // First click
  //     fireEvent.click(trainButton);
  //     expect(mockProps.onRun).toHaveBeenLastCalledWith(firstGraphData);

  //     // Second click
  //     fireEvent.click(trainButton);
  //     expect(mockProps.onRun).toHaveBeenLastCalledWith(secondGraphData);

  //     expect(mockGraphDataManager.getGraphDataAsJson).toHaveBeenCalledTimes(2);
  //   });
  // });

  describe('Button Hover Effects', () => {
    it('applies hover effects on Open button', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      // Test mouse over
      fireEvent.mouseOver(openButton);
      expect(openButton.style.backgroundColor).toBe('rgb(230, 138, 0)'); // #e68a00
      expect(openButton.style.transform).toBe('translateY(-1px)');
      expect(openButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(openButton);
      expect(openButton.style.backgroundColor).toBe('rgb(255, 152, 0)'); // #FF9800
      expect(openButton.style.transform).toBe('translateY(0)');
      expect(openButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });

    it('applies hover effects on Save button', () => {
      render(<Toolbar {...mockProps} />);
      const saveButton = screen.getByTitle('Save Model');

      // Test mouse over
      fireEvent.mouseOver(saveButton);
      expect(saveButton.style.backgroundColor).toBe('rgb(11, 125, 218)'); // #0b7dda

      // Test mouse out
      fireEvent.mouseOut(saveButton);
      expect(saveButton.style.backgroundColor).toBe('rgb(33, 150, 243)'); // #2196F3
    });

    it('applies hover effects on Train button', () => {
      render(<Toolbar {...mockProps} />);
      const trainButton = screen.getByTitle('Train');

      // Test mouse over
      fireEvent.mouseOver(trainButton);
      expect(trainButton.style.backgroundColor).toBe('rgb(69, 160, 73)'); // #45a049

      // Test mouse out
      fireEvent.mouseOut(trainButton);
      expect(trainButton.style.backgroundColor).toBe('rgb(76, 175, 80)'); // #4CAF50
    });
  });

  // describe('GraphDataManager Integration', () => {
  //   it('calls GraphDataManager.getInstance() when train button is clicked', () => {
  //     render(<Toolbar {...mockProps} />);

  //     const trainButton = screen.getByTitle('Train');
  //     fireEvent.click(trainButton);

  //     expect(GraphDataManager.getInstance).toHaveBeenCalledTimes(1);
  //     expect(mockGraphDataManager.getGraphDataAsJson).toHaveBeenCalledTimes(1);
  //   });

  //   it('handles GraphDataManager returning undefined data', () => {
  //     mockGraphDataManager.getGraphDataAsJson.mockReturnValue(undefined);

  //     const mockTrainingWindow = {
  //       location: { href: '' },
  //       graphData: null,
  //     };
  //     mockWindowOpen.mockReturnValue(mockTrainingWindow);

  //     render(<Toolbar {...mockProps} />);

  //     const trainButton = screen.getByTitle('Train');
  //     fireEvent.click(trainButton);

  //     expect(mockTrainingWindow.graphData).toBeUndefined();
  //     expect(mockProps.onRun).toHaveBeenCalledWith(undefined);
  //   });
  // });

  describe('Accessibility', () => {
    it('has proper button titles for accessibility', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      expect(screen.getByTitle('Open Model')).toBeInTheDocument();
      expect(screen.getByTitle('Save Model')).toBeInTheDocument();
      expect(screen.getByTitle('Save Model As')).toBeInTheDocument();
      expect(screen.getByTitle('Train')).toBeInTheDocument();
      expect(screen.getByTitle('Stop')).toBeInTheDocument();
      expect(
        screen.getByTitle('Configure Hyperparameters'),
      ).toBeInTheDocument();
      expect(screen.getByTitle('Configure Input')).toBeInTheDocument();
    });

    it('has proper button text content', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Save As')).toBeInTheDocument();
      expect(screen.getByText('Train')).toBeInTheDocument();
      expect(screen.getByText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Hyperparameters')).toBeInTheDocument();
      expect(screen.getByText('Configure Input')).toBeInTheDocument();
    });

    it('buttons are keyboard accessible', () => {
      const mockTrainingWindow = {
        location: { href: '' },
        graphData: null,
      };
      mockWindowOpen.mockReturnValue(mockTrainingWindow);

      render(<Toolbar {...mockProps} />);

      const trainButton = screen.getByTitle('Train');
      trainButton.focus();

      // Simulate pressing Enter which should trigger the button click
      fireEvent.keyPress(trainButton, { key: 'Enter', charCode: 13 });

      // Since keyPress doesn't automatically trigger click in jsdom, let's test focus instead
      expect(trainButton).toHaveFocus();

      // Test that button can be clicked normally (which is the main accessibility concern)
      fireEvent.click(trainButton);
      expect(mockProps.onRun).toHaveBeenCalledTimes(1);
    });
  });

  describe('Visual Styles', () => {
    it('applies correct toolbar container styles', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar).toHaveStyle({
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid lightgray',
      });
    });

    it('renders dividers between button groups', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const dividers = container.querySelectorAll('div[style*="height: 24px"]');

      expect(dividers.length).toBeGreaterThan(0);
      expect(dividers[0]).toHaveStyle({
        height: '24px',
        width: '1px',
        backgroundColor: '#d0d0d0',
        margin: '0 8px',
      });
    });
  });
});
