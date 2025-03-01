import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import App from '../renderer/App';

// Mock the fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(() => true)
}));

// Mock electron
jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn()
  }
}));

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
