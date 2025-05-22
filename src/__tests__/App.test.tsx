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

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
