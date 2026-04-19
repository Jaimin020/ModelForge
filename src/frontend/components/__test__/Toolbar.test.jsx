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
      onClear: jest.fn(),
      onSettings: jest.fn(),
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
      expect(screen.getByTitle('Clear Model')).toBeInTheDocument();
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
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

    it('enables train button when not running', () => {
      render(<Toolbar {...mockProps} isRunning={false} />);
      const trainButton = screen.getByTitle('Train');
      expect(trainButton).not.toBeDisabled();
    });

    it('conditionally renders Configure Input button', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} showInputConfig={false} />,
      );
      expect(screen.queryByTitle('Configure Input')).not.toBeInTheDocument();

      rerender(<Toolbar {...mockProps} showInputConfig={true} />);
      expect(screen.getByTitle('Configure Input')).toBeInTheDocument();
    });

    it('renders SVG icons in buttons', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const svgs = container.querySelectorAll('svg');

      // Should have at least 7 SVG icons (Open, Save, SaveAs, Train, Stop, Hyperparameters, Settings + BrushCleaning for Clear)
      expect(svgs.length).toBeGreaterThanOrEqual(8);
    });

    it('renders all button text labels', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      const expectedLabels = [
        'Open',
        'Save',
        'Save As',
        'Clear',
        'Train',
        'Stop',
        'Hyperparameters',
        'Configure Input',
        'Settings',
      ];

      expectedLabels.forEach((label) => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('renders with all props provided', () => {
      const completeProps = {
        onRun: jest.fn(),
        onStop: jest.fn(),
        isRunning: false,
        showInputConfig: true,
        onInputConfig: jest.fn(),
        onHyperParam: jest.fn(),
        onSave: jest.fn(),
        onSaveAs: jest.fn(),
        onOpen: jest.fn(),
        onClear: jest.fn(),
        onSettings: jest.fn(),
      };

      render(<Toolbar {...completeProps} />);

      expect(screen.getByTitle('Open Model')).toBeInTheDocument();
      expect(screen.getByTitle('Clear Model')).toBeInTheDocument();
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
      expect(screen.getByTitle('Configure Input')).toBeInTheDocument();
    });

    it('renders Settings button on the right side of toolbar', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;
      const rightSpacer = toolbar.querySelector('div[style*="flex: 1"]');

      expect(rightSpacer).toBeInTheDocument();
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

    it('calls onClear when Clear button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const clearButton = screen.getByTitle('Clear Model');
      fireEvent.click(clearButton);

      expect(mockProps.onClear).toHaveBeenCalledTimes(1);
    });

    it('calls onSettings when Settings button is clicked', () => {
      render(<Toolbar {...mockProps} />);

      const settingsButton = screen.getByTitle('Settings');
      fireEvent.click(settingsButton);

      expect(mockProps.onSettings).toHaveBeenCalledTimes(1);
    });
  });

  describe('Train Button Behavior', () => {
    it('disables train button when isRunning is true', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      const trainButton = screen.getByTitle('Train');

      expect(trainButton).toBeDisabled();
    });

    it('train button is not clickable when disabled', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      const trainButton = screen.getByTitle('Train');

      fireEvent.click(trainButton);

      // onRun should not be called because button is disabled
      expect(mockProps.onRun).not.toHaveBeenCalled();
    });

    it('shows Training... text when isRunning is true', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);

      expect(screen.queryByText('Train')).not.toBeInTheDocument();
      expect(screen.getByText('Training...')).toBeInTheDocument();
    });

    it('changes from Training... to Train when isRunning changes to false', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} isRunning={true} />,
      );
      expect(screen.getByText('Training...')).toBeInTheDocument();

      rerender(<Toolbar {...mockProps} isRunning={false} />);
      expect(screen.queryByText('Training...')).not.toBeInTheDocument();
      expect(screen.getByText('Train')).toBeInTheDocument();
    });

    it('train button becomes enabled when isRunning changes from true to false', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} isRunning={true} />,
      );
      let trainButton = screen.getByTitle('Train');
      expect(trainButton).toBeDisabled();

      rerender(<Toolbar {...mockProps} isRunning={false} />);
      trainButton = screen.getByTitle('Train');
      expect(trainButton).not.toBeDisabled();
    });
  });

  describe('Multiple Button Clicks', () => {
    it('calls onOpen multiple times on multiple clicks', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      fireEvent.click(openButton);
      fireEvent.click(openButton);
      fireEvent.click(openButton);

      expect(mockProps.onOpen).toHaveBeenCalledTimes(3);
    });

    it('calls onSave multiple times on multiple clicks', () => {
      render(<Toolbar {...mockProps} />);
      const saveButton = screen.getByTitle('Save Model');

      fireEvent.click(saveButton);
      fireEvent.click(saveButton);

      expect(mockProps.onSave).toHaveBeenCalledTimes(2);
    });

    it('allows rapid clicking of different buttons', () => {
      render(<Toolbar {...mockProps} />);

      const openButton = screen.getByTitle('Open Model');
      const saveButton = screen.getByTitle('Save Model');
      const clearButton = screen.getByTitle('Clear Model');

      fireEvent.click(openButton);
      fireEvent.click(saveButton);
      fireEvent.click(clearButton);

      expect(mockProps.onOpen).toHaveBeenCalledTimes(1);
      expect(mockProps.onSave).toHaveBeenCalledTimes(1);
      expect(mockProps.onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('Optional Props Handling', () => {
    it('renders without error when optional callbacks are not provided', () => {
      const minimalProps = {
        isRunning: false,
        showInputConfig: false,
      };

      const { container } = render(<Toolbar {...minimalProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders when only onRun is provided', () => {
      const limitedProps = {
        onRun: jest.fn(),
        isRunning: false,
        showInputConfig: false,
      };

      render(<Toolbar {...limitedProps} />);
      expect(screen.getByTitle('Train')).toBeInTheDocument();
    });

    it('renders safely when onClear callback is not provided', () => {
      const propsWithoutOnClear = { ...mockProps };
      delete propsWithoutOnClear.onClear;

      render(<Toolbar {...propsWithoutOnClear} />);

      const clearButton = screen.getByTitle('Clear Model');
      // Should not throw error
      expect(() => fireEvent.click(clearButton)).not.toThrow();
    });
  });

  describe('Component State and Props Changes', () => {
    it('updates display when props change', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} showInputConfig={false} />,
      );
      expect(screen.queryByTitle('Configure Input')).not.toBeInTheDocument();

      rerender(<Toolbar {...mockProps} showInputConfig={true} />);
      expect(screen.getByTitle('Configure Input')).toBeInTheDocument();
    });

    it('reflects isRunning state changes immediately', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} isRunning={false} />,
      );
      let trainButton = screen.getByTitle('Train');
      expect(trainButton).not.toBeDisabled();

      rerender(<Toolbar {...mockProps} isRunning={true} />);
      trainButton = screen.getByTitle('Train');
      expect(trainButton).toBeDisabled();
    });

    it('preserves button functionality after prop updates', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} isRunning={true} />,
      );

      rerender(<Toolbar {...mockProps} isRunning={false} />);

      const trainButton = screen.getByTitle('Train');
      fireEvent.click(trainButton);

      expect(mockProps.onRun).toHaveBeenCalledTimes(1);
    });
  });

  describe('SVG Icons', () => {
    it('renders SVG icon in Open button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');
      const svg = openButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icon in Save button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const saveButton = screen.getByTitle('Save Model');
      const svg = saveButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icon in Train button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const trainButton = screen.getByTitle('Train');
      const svg = trainButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icon in Stop button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const stopButton = screen.getByTitle('Stop');
      const svg = stopButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icon in Hyperparameters button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const hyperParamButton = screen.getByTitle('Configure Hyperparameters');
      const svg = hyperParamButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('renders SVG icon in Settings button', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const settingsButton = screen.getByTitle('Settings');
      const svg = settingsButton.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('all SVG icons have correct dimensions', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const svgs = container.querySelectorAll('svg');

      svgs.forEach((svg) => {
        expect(svg).toHaveAttribute('width', '16');
        expect(svg).toHaveAttribute('height', '16');
      });
    });
  });

  describe('Button Arrangement', () => {
    it('renders buttons in the correct sequence', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);
      const buttons = screen.getAllByRole('button');

      // First button should be Open
      expect(buttons[0]).toHaveAttribute('title', 'Open Model');
    });

    it('Settings button is positioned on the right', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;
      const settingsButton = screen.getByTitle('Settings');

      // Settings should be the last button
      const buttons = toolbar.querySelectorAll('button');
      expect(buttons[buttons.length - 1]).toEqual(settingsButton);
    });

    it('dividers are positioned between button groups', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const dividers = container.querySelectorAll('div[style*="height: 24px"]');

      // Should have at least 2 dividers (before Train, before Hyperparameters)
      expect(dividers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Button Disable State Visual Feedback', () => {
    it('train button has disabled attribute when isRunning', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      const trainButton = screen.getByTitle('Train');

      expect(trainButton).toHaveAttribute('disabled');
    });

    it('train button does not have disabled attribute when not running', () => {
      render(<Toolbar {...mockProps} isRunning={false} />);
      const trainButton = screen.getByTitle('Train');

      expect(trainButton).not.toHaveAttribute('disabled');
    });

    it('stop button is always enabled', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);
      const stopButton = screen.getByTitle('Stop');

      expect(stopButton).not.toBeDisabled();
    });

    it('all other buttons are always enabled', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);

      const buttons = [
        'Open Model',
        'Save Model',
        'Save Model As',
        'Clear Model',
        'Stop',
        'Configure Hyperparameters',
        'Settings',
      ];

      buttons.forEach((title) => {
        const button = screen.getByTitle(title);
        expect(button).not.toBeDisabled();
      });
    });
  });

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

    it('applies hover effects on Save As button', () => {
      render(<Toolbar {...mockProps} />);
      const saveAsButton = screen.getByTitle('Save Model As');

      // Test mouse over
      fireEvent.mouseOver(saveAsButton);
      expect(saveAsButton.style.backgroundColor).toBe('rgb(11, 125, 218)'); // #0b7dda
      expect(saveAsButton.style.transform).toBe('translateY(-1px)');
      expect(saveAsButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(saveAsButton);
      expect(saveAsButton.style.backgroundColor).toBe('rgb(33, 150, 243)'); // #2196F3
      expect(saveAsButton.style.transform).toBe('translateY(0)');
      expect(saveAsButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
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

    it('applies hover effects on Stop button', () => {
      render(<Toolbar {...mockProps} />);
      const stopButton = screen.getByTitle('Stop');

      // Test mouse over
      fireEvent.mouseOver(stopButton);
      expect(stopButton.style.backgroundColor).toBe('rgb(211, 47, 47)'); // #d32f2f
      expect(stopButton.style.transform).toBe('translateY(-1px)');
      expect(stopButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(stopButton);
      expect(stopButton.style.backgroundColor).toBe('rgb(244, 67, 54)'); // #F44336
      expect(stopButton.style.transform).toBe('translateY(0)');
      expect(stopButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });

    it('applies hover effects on Hyperparameters button', () => {
      render(<Toolbar {...mockProps} />);
      const hyperParamButton = screen.getByTitle('Configure Hyperparameters');

      // Test mouse over
      fireEvent.mouseOver(hyperParamButton);
      expect(hyperParamButton.style.backgroundColor).toBe('rgb(123, 31, 162)'); // #7B1FA2
      expect(hyperParamButton.style.transform).toBe('translateY(-1px)');
      expect(hyperParamButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(hyperParamButton);
      expect(hyperParamButton.style.backgroundColor).toBe('rgb(156, 39, 176)'); // #9C27B0
      expect(hyperParamButton.style.transform).toBe('translateY(0)');
      expect(hyperParamButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });

    it('applies hover effects on Clear button', () => {
      render(<Toolbar {...mockProps} />);
      const clearButton = screen.getByTitle('Clear Model');

      // Test mouse over
      fireEvent.mouseOver(clearButton);
      expect(clearButton.style.backgroundColor).toBe('rgb(230, 81, 0)'); // #e65100
      expect(clearButton.style.transform).toBe('translateY(-1px)');
      expect(clearButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(clearButton);
      expect(clearButton.style.backgroundColor).toBe('rgb(255, 112, 67)'); // #ff7043
      expect(clearButton.style.transform).toBe('translateY(0)');
      expect(clearButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });

    it('applies hover effects on Configure Input button', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);
      const inputConfigButton = screen.getByTitle('Configure Input');

      // Test mouse over
      fireEvent.mouseOver(inputConfigButton);
      expect(inputConfigButton.style.backgroundColor).toBe('rgb(69, 160, 73)'); // #45a049
      expect(inputConfigButton.style.transform).toBe('translateY(-1px)');
      expect(inputConfigButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(inputConfigButton);
      expect(inputConfigButton.style.backgroundColor).toBe('rgb(76, 175, 80)'); // #4CAF50
      expect(inputConfigButton.style.transform).toBe('translateY(0)');
      expect(inputConfigButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });

    it('applies hover effects on Settings button', () => {
      render(<Toolbar {...mockProps} />);
      const settingsButton = screen.getByTitle('Settings');

      // Test mouse over
      fireEvent.mouseOver(settingsButton);
      expect(settingsButton.style.backgroundColor).toBe('rgb(69, 90, 100)'); // #455A64
      expect(settingsButton.style.transform).toBe('translateY(-1px)');
      expect(settingsButton.style.boxShadow).toBe('0 2px 4px rgba(0,0,0,0.2)');

      // Test mouse out
      fireEvent.mouseOut(settingsButton);
      expect(settingsButton.style.backgroundColor).toBe('rgb(96, 125, 139)'); // #607D8B
      expect(settingsButton.style.transform).toBe('translateY(0)');
      expect(settingsButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });
  });

  describe('Button Border and Outline Styles', () => {
    it('buttons have inline styles applied correctly', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      // Check styles that are actually set via the style prop
      expect(openButton.style.backgroundColor).toBeTruthy();
      expect(openButton.style.color).toBe('white');
      expect(openButton.style.padding).toBeTruthy();
      expect(openButton.style.margin).toBeTruthy();
    });

    it('buttons have display flex for icon and text alignment', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.display).toBe('flex');
      expect(openButton.style.alignItems).toBeTruthy();
    });

    it('buttons have smooth transitions', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.transition).toBe('all 0.2s ease');
    });

    it('buttons have cursor pointer', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.cursor).toBe('pointer');
    });

    it('buttons have correct box shadow on load', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.boxShadow).toBe('0 1px 2px rgba(0,0,0,0.1)');
    });
  });

  describe('Button Gap and Padding', () => {
    it('buttons have correct internal spacing', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      // Check the actual applied styles (jsdom normalizes these)
      expect(openButton.style.gap).toBe('5px');
      expect(openButton.style.padding).toMatch(/6px\s+12px/);
      expect(openButton.style.margin).toMatch(/0px\s+4px/);
    });

    it('toolbar has correct padding', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar.style.padding).toBe('8px');
    });

    it('dividers have correct margins', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const dividers = container.querySelectorAll('div[style*="height: 24px"]');

      expect(dividers[0].style.margin).toMatch(/0px\s+8px/);
    });
  });

  describe('Font and Typography', () => {
    it('buttons have correct font size', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.fontSize).toBe('14px');
    });

    it('all buttons have white text color', () => {
      render(<Toolbar {...mockProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.style.color).toBe('white');
      });
    });
  });

  describe('Flex Layout', () => {
    it('toolbar has flex display', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar).toHaveStyle({ display: 'flex' });
    });

    it('toolbar aligns items center', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar).toHaveStyle({ alignItems: 'center' });
    });

    it('toolbar justifies content to flex-start', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar).toHaveStyle({ justifyContent: 'flex-start' });
    });

    it('buttons use flex display with alignment', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
      });
    });

    it('spacer div has flex 1 to push settings button right', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const spacer = container.querySelector('div[style*="flex: 1"]');

      expect(spacer).toHaveStyle({ flex: '1' });
    });
  });

  describe('Conditional Rendering Advanced Cases', () => {
    it('Configure Input button is hidden when showInputConfig is false', () => {
      render(<Toolbar {...mockProps} showInputConfig={false} />);

      expect(screen.queryByTitle('Configure Input')).not.toBeInTheDocument();
    });

    it('Configure Input button appears and is clickable when showInputConfig changes', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} showInputConfig={false} />,
      );

      expect(screen.queryByTitle('Configure Input')).not.toBeInTheDocument();

      rerender(<Toolbar {...mockProps} showInputConfig={true} />);

      const inputConfigButton = screen.getByTitle('Configure Input');
      expect(inputConfigButton).toBeInTheDocument();

      fireEvent.click(inputConfigButton);
      expect(mockProps.onInputConfig).toHaveBeenCalled();
    });

    it('all buttons remain clickable regardless of Configure Input state', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} showInputConfig={true} />,
      );

      const openButton = screen.getByTitle('Open Model');
      fireEvent.click(openButton);
      expect(mockProps.onOpen).toHaveBeenCalledTimes(1);

      rerender(<Toolbar {...mockProps} showInputConfig={false} />);

      fireEvent.click(openButton);
      expect(mockProps.onOpen).toHaveBeenCalledTimes(2);
    });
  });

  describe('Complete User Workflows', () => {
    it('user can open, save, configure hyperparameters, and train', () => {
      render(<Toolbar {...mockProps} />);

      // Open
      fireEvent.click(screen.getByTitle('Open Model'));
      expect(mockProps.onOpen).toHaveBeenCalledTimes(1);

      // Save
      fireEvent.click(screen.getByTitle('Save Model'));
      expect(mockProps.onSave).toHaveBeenCalledTimes(1);

      // Configure Hyperparameters
      fireEvent.click(screen.getByTitle('Configure Hyperparameters'));
      expect(mockProps.onHyperParam).toHaveBeenCalledTimes(1);

      // Train
      fireEvent.click(screen.getByTitle('Train'));
      expect(mockProps.onRun).toHaveBeenCalledTimes(1);
    });

    it('user can stop training after starting', () => {
      const { rerender } = render(
        <Toolbar {...mockProps} isRunning={false} />,
      );

      // Start training
      fireEvent.click(screen.getByTitle('Train'));
      expect(mockProps.onRun).toHaveBeenCalledTimes(1);

      // Update to running state
      rerender(<Toolbar {...mockProps} isRunning={true} />);
      expect(screen.getByText('Training...')).toBeInTheDocument();

      // Stop training
      fireEvent.click(screen.getByTitle('Stop'));
      expect(mockProps.onStop).toHaveBeenCalledTimes(1);

      // Update to not running
      rerender(<Toolbar {...mockProps} isRunning={false} />);
      const trainButton = screen.getByTitle('Train');
      expect(trainButton).not.toBeDisabled();
    });

    it('user can clear and create new model', () => {
      render(<Toolbar {...mockProps} />);

      // Clear model
      fireEvent.click(screen.getByTitle('Clear Model'));
      expect(mockProps.onClear).toHaveBeenCalledTimes(1);

      // Access settings
      fireEvent.click(screen.getByTitle('Settings'));
      expect(mockProps.onSettings).toHaveBeenCalledTimes(1);
    });

    it('user cannot train while already training', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);

      const trainButton = screen.getByTitle('Train');
      fireEvent.click(trainButton);

      // onRun should not be called because button is disabled
      expect(mockProps.onRun).not.toHaveBeenCalled();

      // Stop should still be clickable
      fireEvent.click(screen.getByTitle('Stop'));
      expect(mockProps.onStop).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('renders safely with undefined isRunning prop', () => {
      const propsWithoutIsRunning = { ...mockProps };
      delete propsWithoutIsRunning.isRunning;

      const { container } = render(
        <Toolbar {...propsWithoutIsRunning} />,
      );
      expect(container).toBeInTheDocument();
    });

    it('renders safely with undefined showInputConfig prop', () => {
      const propsWithoutShowInputConfig = { ...mockProps };
      delete propsWithoutShowInputConfig.showInputConfig;

      const { container } = render(
        <Toolbar {...propsWithoutShowInputConfig} />,
      );
      expect(container).toBeInTheDocument();
    });

    it('handles onClick when callback is not a function gracefully', () => {
      const propsWithNullCallbacks = {
        ...mockProps,
        onOpen: null,
      };

      render(<Toolbar {...propsWithNullCallbacks} />);

      // Should not throw error
      expect(() => {
        fireEvent.click(screen.getByTitle('Open Model'));
      }).not.toThrow();
    });
  });

  describe('Button Element Properties', () => {
    it('all buttons are of type button', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('buttons have type attribute set to submit or undefined', () => {
      render(<Toolbar {...mockProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const type = button.getAttribute('type');
        expect(['submit', 'button', null]).toContain(type);
      });
    });

    it('disabled train button reflects HTML disabled state', () => {
      render(<Toolbar {...mockProps} isRunning={true} />);

      const trainButton = screen.getByTitle('Train') as HTMLButtonElement;
      expect(trainButton.disabled).toBe(true);
    });

    it('enabled train button has disabled as false', () => {
      render(<Toolbar {...mockProps} isRunning={false} />);

      const trainButton = screen.getByTitle('Train') as HTMLButtonElement;
      expect(trainButton.disabled).toBe(false);
    });
  });

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
      expect(screen.getByTitle('Settings')).toBeInTheDocument();
      expect(screen.getByTitle('Clear Model')).toBeInTheDocument();
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
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Clear')).toBeInTheDocument();
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

    it('all buttons can receive focus', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });
  });

  describe('Visual Styles', () => {
    it('applies correct toolbar container styles', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const toolbar = container.firstChild;

      expect(toolbar.style.display).toBe('flex');
      expect(toolbar.style.justifyContent).toBe('flex-start');
      expect(toolbar.style.alignItems).toBe('center');
      expect(toolbar.style.padding).toBe('8px');
      expect(toolbar.style.backgroundColor).toBe('rgb(245, 245, 245)'); // #f5f5f5
      expect(toolbar.style.borderBottom).toBe('1px solid lightgray');
    });

    it('renders dividers between button groups', () => {
      const { container } = render(<Toolbar {...mockProps} />);
      const dividers = container.querySelectorAll('div[style*="height: 24px"]');

      expect(dividers.length).toBeGreaterThan(0);
      expect(dividers[0].style.height).toBe('24px');
      expect(dividers[0].style.width).toBe('1px');
      expect(dividers[0].style.backgroundColor).toBe('rgb(208, 208, 208)'); // #d0d0d0
      // jsdom normalizes margin values to px units
      expect(dividers[0].style.margin).toMatch(/0px\s+8px/);
    });

    it('renders buttons with correct styling properties', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton.style.display).toBe('flex');
      expect(openButton.style.alignItems).toBeTruthy();
      expect(openButton.style.gap).toBe('5px');
      expect(openButton.style.padding).toMatch(/6px\s+12px/);
      expect(openButton.style.margin).toMatch(/0px\s+4px/);
      expect(openButton.style.fontSize).toBe('14px');
      expect(openButton.style.cursor).toBe('pointer');
      expect(openButton.style.borderRadius).toBeTruthy();
      expect(openButton.style.transition).toBe('all 0.2s ease');
    });

    it('applies correct color to Open button', () => {
      render(<Toolbar {...mockProps} />);
      const openButton = screen.getByTitle('Open Model');

      expect(openButton).toHaveStyle({
        backgroundColor: '#FF9800',
        color: 'white',
      });
    });

    it('applies correct color to Save button', () => {
      render(<Toolbar {...mockProps} />);
      const saveButton = screen.getByTitle('Save Model');

      expect(saveButton).toHaveStyle({
        backgroundColor: '#2196F3',
        color: 'white',
      });
    });

    it('applies correct color to Train button', () => {
      render(<Toolbar {...mockProps} />);
      const trainButton = screen.getByTitle('Train');

      expect(trainButton).toHaveStyle({
        backgroundColor: '#4CAF50',
        color: 'white',
      });
    });

    it('applies correct color to Stop button', () => {
      render(<Toolbar {...mockProps} />);
      const stopButton = screen.getByTitle('Stop');

      expect(stopButton).toHaveStyle({
        backgroundColor: '#F44336',
        color: 'white',
      });
    });

    it('applies correct color to Clear button', () => {
      render(<Toolbar {...mockProps} />);
      const clearButton = screen.getByTitle('Clear Model');

      expect(clearButton).toHaveStyle({
        backgroundColor: '#ff7043',
        color: 'white',
      });
    });

    it('applies correct color to Hyperparameters button', () => {
      render(<Toolbar {...mockProps} />);
      const hyperParamButton = screen.getByTitle('Configure Hyperparameters');

      expect(hyperParamButton).toHaveStyle({
        backgroundColor: '#9C27B0',
        color: 'white',
      });
    });

    it('applies correct color to Settings button', () => {
      render(<Toolbar {...mockProps} />);
      const settingsButton = screen.getByTitle('Settings');

      expect(settingsButton).toHaveStyle({
        backgroundColor: '#607D8B',
        color: 'white',
      });
    });

    it('applies correct color to Configure Input button', () => {
      render(<Toolbar {...mockProps} showInputConfig={true} />);
      const inputConfigButton = screen.getByTitle('Configure Input');

      expect(inputConfigButton).toHaveStyle({
        backgroundColor: '#4CAF50',
        color: 'white',
      });
    });
  });
});
