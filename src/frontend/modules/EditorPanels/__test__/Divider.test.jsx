import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Divider from '../Divider';

describe('Divider Component', () => {
  let mockSetLeftPanelWidth;

  beforeEach(() => {
    mockSetLeftPanelWidth = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the divider element', () => {
    const { container } = render(
      <Divider setLeftPanelWidth={mockSetLeftPanelWidth} />
    );
    
    const divider = container.querySelector('.divider');
    expect(divider).toBeInTheDocument();
  });

  it('calls setLeftPanelWidth with clientX when dragging', () => {
    const { container } = render(
      <Divider setLeftPanelWidth={mockSetLeftPanelWidth} />
    );
    
    const divider = container.querySelector('.divider');
    
    // Start dragging
    fireEvent.mouseDown(divider);
    
    // Simulate mouse move
    fireEvent.mouseMove(document, { clientX: 300 });
    
    expect(mockSetLeftPanelWidth).toHaveBeenCalledWith(300);
  });

  it('does not call setLeftPanelWidth when not dragging', () => {
    render(<Divider setLeftPanelWidth={mockSetLeftPanelWidth} />);
    
    // Simulate mouse move without starting drag
    fireEvent.mouseMove(document, { clientX: 300 });
    
    expect(mockSetLeftPanelWidth).not.toHaveBeenCalled();
  });

  it('stops dragging on mouse up', () => {
    const { container } = render(
      <Divider setLeftPanelWidth={mockSetLeftPanelWidth} />
    );
    
    const divider = container.querySelector('.divider');
    
    // Start dragging
    fireEvent.mouseDown(divider);
    fireEvent.mouseMove(document, { clientX: 300 });
    expect(mockSetLeftPanelWidth).toHaveBeenCalledWith(300);
    
    // Stop dragging
    fireEvent.mouseUp(document);
    
    // Mouse move should not trigger setLeftPanelWidth anymore
    fireEvent.mouseMove(document, { clientX: 400 });
    expect(mockSetLeftPanelWidth).toHaveBeenCalledTimes(1);
  });

  it('adds and removes event listeners correctly', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { container } = render(
      <Divider setLeftPanelWidth={mockSetLeftPanelWidth} />
    );
    
    const divider = container.querySelector('.divider');
    
    // Start dragging - should add event listeners
    fireEvent.mouseDown(divider);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    // Stop dragging - should remove event listeners
    fireEvent.mouseUp(document);
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('handles multiple drag sessions correctly', () => {
    const { container } = render(
      <Divider setLeftPanelWidth={mockSetLeftPanelWidth} />
    );
    
    const divider = container.querySelector('.divider');
    
    // First drag session
    fireEvent.mouseDown(divider);
    fireEvent.mouseMove(document, { clientX: 200 });
    fireEvent.mouseUp(document);
    
    // Second drag session
    fireEvent.mouseDown(divider);
    fireEvent.mouseMove(document, { clientX: 400 });
    fireEvent.mouseUp(document);
    
    expect(mockSetLeftPanelWidth).toHaveBeenCalledTimes(2);
    expect(mockSetLeftPanelWidth).toHaveBeenNthCalledWith(1, 200);
    expect(mockSetLeftPanelWidth).toHaveBeenNthCalledWith(2, 400);
  });
});
