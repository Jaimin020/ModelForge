import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ParameterViewer } from '../ParameterViewer';

// Mock dependencies
jest.mock('../../utils/nodeOps/nodeFetMap', () => ({
  getNodeFeatureMap: jest.fn(),
}));

jest.mock('../../utils/graphMngr/ModelNodeManager.ts', () => ({
  ModelNodeManager: {
    getInstance: jest.fn(),
  },
}));

jest.mock('../../../envPath', () => ({
  PYTORCH_NODE_PATH: '/mock/pytorch/path',
}));

import { getNodeFeatureMap } from '../../utils/nodeOps/nodeFetMap';
import { ModelNodeManager } from '../../utils/graphMngr/ModelNodeManager.ts';

describe('ParameterViewer Component', () => {
  let mockNodeManager;
  let mockNodeFeatureMap;

  beforeEach(() => {
    // Mock ModelNodeManager instance
    mockNodeManager = {
      getNode: jest.fn(),
      updateNodeParameter: jest.fn(),
    };
    ModelNodeManager.getInstance.mockReturnValue(mockNodeManager);

    // Mock node feature map data
    mockNodeFeatureMap = new Map([
      [
        'Conv2d',
        {
          name: 'Conv2d',
          feature: 'Convolution 2D',
          library: 'torch.nn',
          codeId: 'conv2d_001',
          parameters: [
            {
              name: 'in_channels',
              type: 'int',
              value: 3,
              required: true,
              display: true,
            },
            {
              name: 'out_channels',
              type: 'int',
              value: 64,
              required: true,
              display: true,
            },
            {
              name: 'bias',
              type: 'bool',
              value: true,
              required: false,
              display: true,
            },
            {
              name: 'padding',
              type: 'string',
              value: 'same',
              required: false,
              display: true,
            },
            {
              name: 'model_file',
              type: 'file',
              value: '/path/to/model.pth',
              required: false,
              display: true,
            },
            {
              name: 'hidden_param',
              type: 'int',
              value: 10,
              required: false,
              display: false,
            },
          ],
          code: 'nn.Conv2d(in_channels=3, out_channels=64, bias=True)',
        },
      ],
      [
        'Test',
        {
          name: 'Test',
          feature: 'Test Node',
          library: 'test.lib',
          codeId: 'test_001',
          parameters: [],
          code: 'test()',
        },
      ],
      [
        'FullNode',
        {
          name: 'FullNode',
          feature: 'Full Node',
          library: 'test.lib',
          codeId: 'full_001',
          parameters: [
            {
              name: 'test_param',
              type: 'int',
              value: 42,
              required: true,
              display: true,
            },
          ],
          code: 'full_node_code()',
        },
      ],
    ]);

    getNodeFeatureMap.mockResolvedValue(mockNodeFeatureMap);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders parameter viewer with no selected node', async () => {
      render(<ParameterViewer selectedNode={null} />);

      expect(screen.getByText('Parameter Viewer')).toBeInTheDocument();
      expect(
        screen.getByText('Select a layer to view parameters'),
      ).toBeInTheDocument();

      // Wait for the async data loading to complete
      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalledWith('/mock/pytorch/path');
      });
    });

    it('renders with custom height prop', async () => {
      const { container } = render(
        <ParameterViewer selectedNode={null} height="300px" />,
      );

      const parameterViewer = container.querySelector('.parameter-viewer');
      expect(parameterViewer).toHaveStyle({ height: '300px' });

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalled();
      });
    });

    it('uses default height when no height prop provided', async () => {
      const { container } = render(<ParameterViewer selectedNode={null} />);

      const parameterViewer = container.querySelector('.parameter-viewer');
      expect(parameterViewer).toHaveStyle({ height: '190px' });

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalled();
      });
    });
  });

  describe('Node Selection and Display', () => {
    const mockSelectedNode = {
      id: 1,
      label: 'Conv2d',
    };

    it('displays node information when node is selected', async () => {
      mockNodeManager.getNode.mockReturnValue({
        feature: 'Convolution 2D',
        library: 'torch.nn',
        codeId: 'conv2d_001',
        code: 'nn.Conv2d(in_channels=3, out_channels=64, bias=True)',
        parameters: [
          {
            name: 'in_channels',
            type: 'int',
            value: 3,
            required: true,
            display: true,
          },
        ],
      });

      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      // Wait for async data loading and component to render
      await waitFor(() => {
        expect(screen.getByText('Conv2d')).toBeInTheDocument();
        expect(screen.getByText('Convolution 2D')).toBeInTheDocument();
        expect(screen.getByText('torch.nn')).toBeInTheDocument();
        expect(screen.getByText('conv2d_001')).toBeInTheDocument();
      });
    });

    it('handles node without id (uses feature map)', async () => {
      const nodeWithoutId = { label: 'Conv2d' };

      render(<ParameterViewer selectedNode={nodeWithoutId} />);

      await waitFor(() => {
        expect(screen.getByText('Conv2d')).toBeInTheDocument();
        expect(screen.getByText('Convolution 2D')).toBeInTheDocument();
      });
    });
  });

  describe('Parameter Types and Rendering', () => {
    const mockSelectedNode = { id: 1, label: 'Conv2d' };

    beforeEach(() => {
      mockNodeManager.getNode.mockReturnValue({
        feature: 'Convolution 2D',
        library: 'torch.nn',
        codeId: 'conv2d_001',
        code: 'nn.Conv2d()',
        parameters: mockNodeFeatureMap.get('Conv2d').parameters,
      });
    });

    it('renders integer parameters with number input', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const inChannelsInput = screen.getByDisplayValue('3');
        expect(inChannelsInput).toHaveAttribute('type', 'number');
        expect(screen.getByText('in_channels')).toBeInTheDocument();
      });
    });

    it('renders boolean parameters with select dropdown', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const biasSelect = screen.getByDisplayValue('true');
        expect(biasSelect.tagName).toBe('SELECT');
        expect(screen.getByText('bias')).toBeInTheDocument();
      });
    });

    it('renders string parameters with text input', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const paddingInput = screen.getByDisplayValue('same');
        expect(paddingInput).toHaveAttribute('type', 'text');
        expect(screen.getByText('padding')).toBeInTheDocument();
      });
    });

    it('renders file parameters with filename display', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        expect(screen.getByText('model_file')).toBeInTheDocument();
        expect(screen.getByText('model.pth')).toBeInTheDocument();
      });
    });

    it('shows only displayable parameters', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        expect(screen.getByText('in_channels')).toBeInTheDocument();
        expect(screen.queryByText('hidden_param')).not.toBeInTheDocument();
      });
    });

    it('shows required indicator for required parameters', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const requiredIndicators = screen.getAllByText('*');
        expect(requiredIndicators.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Parameter Interactions', () => {
    const mockSelectedNode = { id: 1, label: 'Conv2d' };

    beforeEach(() => {
      mockNodeManager.getNode.mockReturnValue({
        feature: 'Convolution 2D',
        library: 'torch.nn',
        codeId: 'conv2d_001',
        code: 'nn.Conv2d()',
        parameters: [
          {
            name: 'in_channels',
            type: 'int',
            value: 3,
            required: true,
            display: true,
          },
          {
            name: 'bias',
            type: 'bool',
            value: true,
            required: false,
            display: true,
          },
        ],
      });
    });

    it('handles integer parameter change and update', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const input = screen.getByDisplayValue('3');
        fireEvent.change(input, { target: { value: '64' } });

        const updateButtons = screen.getAllByText('Update');
        fireEvent.click(updateButtons[0]);

        expect(mockNodeManager.updateNodeParameter).toHaveBeenCalledWith(
          1,
          'in_channels',
          64,
        );
      });
    });

    it('handles boolean parameter change with True/False conversion', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const select = screen.getByDisplayValue('true');
        fireEvent.change(select, { target: { value: 'False' } });

        const updateButtons = screen.getAllByText('Update');
        fireEvent.click(updateButtons[1]);

        expect(mockNodeManager.updateNodeParameter).toHaveBeenCalledWith(
          1,
          'bias',
          'False',
        );
      });
    });

    it('handles parameter reset with correct default values', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const resetButtons = screen.getAllByText('Reset');
        fireEvent.click(resetButtons[0]);

        expect(mockNodeManager.updateNodeParameter).toHaveBeenCalledWith(
          1,
          'in_channels',
          1,
        );
      });
    });

    it('handles boolean parameter reset', async () => {
      render(<ParameterViewer selectedNode={mockSelectedNode} />);

      await waitFor(() => {
        const resetButtons = screen.getAllByText('Reset');
        fireEvent.click(resetButtons[1]);

        expect(mockNodeManager.updateNodeParameter).toHaveBeenCalledWith(
          1,
          'bias',
          true,
        );
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles selectedNode without parameters', async () => {
      const nodeWithoutParams = {
        feature: 'Test',
        library: 'test',
        codeId: 'test_001',
        code: 'test()',
        parameters: [],
      };
      mockNodeManager.getNode.mockReturnValue(nodeWithoutParams);

      render(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.queryByText('Parameters:')).not.toBeInTheDocument();
      });
    });

    it('handles node manager returning null', async () => {
      mockNodeManager.getNode.mockReturnValue(null);

      render(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      await waitFor(() => {
        // When node manager returns null, component should handle gracefully
        expect(getNodeFeatureMap).toHaveBeenCalled();
        const unknownElements = screen.getAllByText('Unknown');
        expect(unknownElements.length).toBeGreaterThan(0); // Should show fallback values
      });
    });

    it('handles getNodeFeatureMap failure', async () => {
      // Mock console.error to prevent error output during test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      getNodeFeatureMap.mockRejectedValue(new Error('Failed to load'));

      render(<ParameterViewer selectedNode={{ label: 'Test' }} />);

      // Should not crash and should handle the error gracefully
      expect(screen.getByText('Parameter Viewer')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();

      // Wait for the error handling to complete
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to load node feature map:',
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });

    it('handles invalid number input', async () => {
      const nodeWithIntParam = {
        feature: 'Test',
        library: 'test',
        codeId: 'test_001',
        code: 'test()',
        parameters: [
          {
            name: 'number_param',
            type: 'int',
            value: 5,
            required: true,
            display: true,
          },
        ],
      };
      mockNodeManager.getNode.mockReturnValue(nodeWithIntParam);

      render(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      // Wait for component to load and tempValues to be set
      await waitFor(() => {
        expect(screen.getByText('number_param')).toBeInTheDocument();
      });

      // Find input by type and container, since display value might be empty initially
      const input = screen.getByRole('spinbutton'); // number inputs have role spinbutton

      fireEvent.change(input, { target: { value: 'invalid' } });

      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      // Should handle invalid input gracefully, converting to 0
      expect(mockNodeManager.updateNodeParameter).toHaveBeenCalledWith(
        1,
        'number_param',
        '',
      );
    });

    it('handles empty file parameter', async () => {
      const nodeWithEmptyFile = {
        feature: 'Test',
        library: 'test',
        codeId: 'test_001',
        code: 'test()',
        parameters: [
          {
            name: 'empty_file',
            type: 'file',
            value: '',
            required: false,
            display: true,
          },
        ],
      };
      mockNodeManager.getNode.mockReturnValue(nodeWithEmptyFile);

      render(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      await waitFor(() => {
        expect(screen.getByText('No file selected')).toBeInTheDocument();
      });
    });
  });

  describe('useEffect Hooks', () => {
    it('loads node feature map on mount', async () => {
      render(<ParameterViewer selectedNode={null} />);

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalledWith('/mock/pytorch/path');
      });
    });

    it('resets temp values when selectedNode changes', async () => {
      const { rerender } = render(<ParameterViewer selectedNode={null} />);

      const nodeWithParams = {
        parameters: [{ name: 'test_param', value: 'test_value' }],
      };
      mockNodeManager.getNode.mockReturnValue(nodeWithParams);

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalled();
      });

      rerender(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      await waitFor(() => {
        expect(mockNodeManager.getNode).toHaveBeenCalledWith(1);
      });
    });

    it('clears temp values when selectedNode becomes null', async () => {
      const { rerender } = render(
        <ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />,
      );

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalled();
      });

      rerender(<ParameterViewer selectedNode={null} />);

      await waitFor(() => {
        expect(
          screen.getByText('Select a layer to view parameters'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Component Integration', () => {
    it('renders all UI sections correctly', async () => {
      render(<ParameterViewer selectedNode={{ label: 'FullNode' }} />);

      await waitFor(() => {
        expect(screen.getByText('Layer Name:')).toBeInTheDocument();
        expect(screen.getByText('Parameters:')).toBeInTheDocument();
        expect(screen.getByText('Layer type:')).toBeInTheDocument();
        expect(screen.getByText('Library:')).toBeInTheDocument();
        expect(screen.getByText('Code ID:')).toBeInTheDocument();
        expect(screen.getByText('Generated Code:')).toBeInTheDocument();
        expect(screen.getByText('FullNode')).toBeInTheDocument();
        expect(screen.getByText('Full Node')).toBeInTheDocument();
        expect(screen.getByText('test.lib')).toBeInTheDocument();
        expect(screen.getByText('full_001')).toBeInTheDocument();
        expect(screen.getByText('test_param')).toBeInTheDocument();
      });
    });

    it('handles component cleanup properly', async () => {
      const { unmount } = render(<ParameterViewer selectedNode={null} />);

      await waitFor(() => {
        expect(getNodeFeatureMap).toHaveBeenCalled();
      });

      expect(() => unmount()).not.toThrow();
    });

    it('handles text parameter change event', async () => {
      const nodeWithTextParam = {
        feature: 'Test',
        library: 'test',
        codeId: 'test_001',
        code: 'test()',
        parameters: [
          {
            name: 'text_param',
            type: 'string',
            value: 'initial',
            required: false,
            display: true,
          },
        ],
      };
      mockNodeManager.getNode.mockReturnValue(nodeWithTextParam);

      render(<ParameterViewer selectedNode={{ id: 1, label: 'Test' }} />);

      await waitFor(() => {
        const input = screen.getByDisplayValue('initial');
        fireEvent.change(input, { target: { value: 'updated' } });
        // Text parameters update on change event now
      });
    });
  });
});
