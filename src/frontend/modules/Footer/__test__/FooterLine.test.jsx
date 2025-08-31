import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FooterLine from '../FooterLine';

describe('FooterLine Component', () => {
  it('renders with default props', () => {
    const { container, getByText } = render(<FooterLine />);

    // Should show loading animation by default (isRunning=true)
    const loader = container.querySelector('.lds-facebook');
    expect(loader).toBeInTheDocument();

    // Should show default framework name
    expect(getByText('PyTorch')).toBeInTheDocument();

    // Should not show "Ready" text when running
    expect(container.querySelector('.status-text')).not.toBeInTheDocument();
  });

  it('shows loading animation when isRunning is true', () => {
    const { container } = render(<FooterLine isRunning={true} />);

    const loader = container.querySelector('.lds-facebook');
    expect(loader).toBeInTheDocument();

    // Loader should have 3 div elements
    const loaderDivs = loader.querySelectorAll('div');
    expect(loaderDivs).toHaveLength(3);

    // Should not show "Ready" text
    expect(container.querySelector('.status-text')).not.toBeInTheDocument();
  });

  it('shows "Ready" text when isRunning is false', () => {
    const { container, getByText } = render(<FooterLine isRunning={false} />);

    // Should show "Ready" text
    expect(getByText('Ready')).toBeInTheDocument();
    expect(container.querySelector('.status-text')).toBeInTheDocument();

    // Should not show loading animation
    expect(container.querySelector('.lds-facebook')).not.toBeInTheDocument();
  });

  it('displays custom framework name', () => {
    const { getByText } = render(<FooterLine framework="TensorFlow" />);

    expect(getByText('TensorFlow')).toBeInTheDocument();
  });

  it('displays custom framework with isRunning false', () => {
    const { getByText, container } = render(
      <FooterLine isRunning={false} framework="JAX" />,
    );

    expect(getByText('Ready')).toBeInTheDocument();
    expect(getByText('JAX')).toBeInTheDocument();
    expect(container.querySelector('.lds-facebook')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<FooterLine />);

    expect(container.querySelector('.framework-footer')).toBeInTheDocument();
    expect(container.querySelector('.framework-info')).toBeInTheDocument();
    expect(
      container.querySelector('.loading-container-footer'),
    ).toBeInTheDocument();
    expect(container.querySelector('.framework-name')).toBeInTheDocument();
  });

  it('renders both named and default exports correctly', () => {
    const { getByText: getByText1 } = render(<FooterLine framework="Test1" />);
    expect(getByText1('Test1')).toBeInTheDocument();

    // Test named export
    const { FooterLine: NamedExport } = require('../FooterLine');
    const { getByText: getByText2 } = render(<NamedExport framework="Test2" />);
    expect(getByText2('Test2')).toBeInTheDocument();
  });

  it('handles empty string framework name', () => {
    const { container } = render(<FooterLine framework="" />);

    const frameworkElement = container.querySelector('.framework-name');
    expect(frameworkElement).toBeInTheDocument();
    expect(frameworkElement.textContent).toBe('');
  });

  it('handles long framework names', () => {
    const longName = 'Very Long Framework Name That Might Overflow';
    const { getByText } = render(<FooterLine framework={longName} />);

    expect(getByText(longName)).toBeInTheDocument();
  });
});
