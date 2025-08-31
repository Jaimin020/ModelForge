import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingOverlay from '../LoadingModal';

describe('LoadingOverlay Component', () => {
  it('renders null when isVisible is false', () => {
    const { container } = render(<LoadingOverlay isVisible={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders loading overlay when isVisible is true', () => {
    const { container } = render(<LoadingOverlay isVisible={true} />);
    
    expect(container.querySelector('.loading-overlay')).toBeInTheDocument();
    expect(container.querySelector('.loading-container')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('displays default message when no message prop is provided', () => {
    const { getByText } = render(<LoadingOverlay isVisible={true} />);
    
    expect(getByText('Processing...')).toBeInTheDocument();
  });

  it('displays custom message when message prop is provided', () => {
    const customMessage = 'Loading data...';
    const { getByText } = render(
      <LoadingOverlay isVisible={true} message={customMessage} />
    );
    
    expect(getByText(customMessage)).toBeInTheDocument();
  });

  it('contains spinner elements when visible', () => {
    const { container } = render(<LoadingOverlay isVisible={true} />);
    
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    
    const doubleBounce1 = container.querySelector('.double-bounce1');
    const doubleBounce2 = container.querySelector('.double-bounce2');
    
    expect(doubleBounce1).toBeInTheDocument();
    expect(doubleBounce2).toBeInTheDocument();
  });

  it('has correct CSS classes when visible', () => {
    const { container } = render(<LoadingOverlay isVisible={true} />);
    
    expect(container.querySelector('.loading-overlay')).toBeInTheDocument();
    expect(container.querySelector('.loading-container')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
    expect(container.querySelector('.loading-message')).toBeInTheDocument();
    expect(container.querySelector('.double-bounce1')).toBeInTheDocument();
    expect(container.querySelector('.double-bounce2')).toBeInTheDocument();
  });

  it('does not render any elements when isVisible is false regardless of message', () => {
    const { container } = render(
      <LoadingOverlay isVisible={false} message="This should not appear" />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders both named and default exports correctly', () => {
    const { getByText } = render(<LoadingOverlay isVisible={true} message="Test1" />);
    expect(getByText('Test1')).toBeInTheDocument();
    
    // Test named export
    const { LoadingOverlay: NamedExport } = require('../LoadingModal');
    const { getByText: getByText2 } = render(
      <NamedExport isVisible={true} message="Test2" />
    );
    expect(getByText2('Test2')).toBeInTheDocument();
  });

  it('handles empty string message', () => {
    const { container } = render(
      <LoadingOverlay isVisible={true} message="" />
    );
    
    const messageElement = container.querySelector('.loading-message');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.textContent).toBe('');
  });

  it('handles very long message', () => {
    const longMessage = 'This is a very long loading message that might span multiple lines and test how the component handles lengthy text content';
    const { getByText } = render(
      <LoadingOverlay isVisible={true} message={longMessage} />
    );
    
    expect(getByText(longMessage)).toBeInTheDocument();
  });

  it('toggles visibility correctly', () => {
    const { container, rerender } = render(<LoadingOverlay isVisible={false} />);
    
    // Initially not visible
    expect(container.firstChild).toBeNull();
    
    // Show overlay
    rerender(<LoadingOverlay isVisible={true} message="Now visible" />);
    expect(container.querySelector('.loading-overlay')).toBeInTheDocument();
    
    // Hide overlay again
    rerender(<LoadingOverlay isVisible={false} message="Hidden again" />);
    expect(container.firstChild).toBeNull();
  });

  it('updates message when props change', () => {
    const { getByText, rerender } = render(
      <LoadingOverlay isVisible={true} message="Initial message" />
    );
    
    expect(getByText('Initial message')).toBeInTheDocument();
    
    // Update message
    rerender(<LoadingOverlay isVisible={true} message="Updated message" />);
    expect(getByText('Updated message')).toBeInTheDocument();
  });
});
