import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';
import 'jest-canvas-mock';

// Mock window.file
Object.defineProperty(window, 'file', {
  value: {
    readFile: jest.fn().mockResolvedValue('<xml></xml>'),
    writeFile: jest.fn().mockResolvedValue(true),
    // Add other methods as needed
  },
  writable: true
});

// Mock window.windowMngr
Object.defineProperty(window, 'windowMngr', {
  value: {
    openNewWindow: jest.fn().mockResolvedValue('window-id-123')
  },
  writable: true
});

// Mock ResizeObserver with proper TypeScript typing
global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

// Mock components with async operations
jest.mock('../frontend/modules/LayerSelectionPanel/LayerSelectionPanel.jsx', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mocked-layer-panel">Layer Panel</div>
  };
});

jest.mock('../frontend/components/ParameterViewer.jsx', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mocked-parameter-viewer">Parameter Viewer</div>
  };
});

jest.mock('../frontend/modules/Workspace/Editor.jsx', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mocked-editor">Editor</div>
  };
});

// Mock utility functions
jest.mock('../frontend/utils/nodeOps/nodeName.jsx', () => ({
  getNodeNames: jest.fn().mockResolvedValue(['node1', 'node2']),
  getNodeFeatureMap: jest.fn().mockResolvedValue({ node1: { params: [] } })
}));

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
