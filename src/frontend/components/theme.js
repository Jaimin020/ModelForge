import { createLightTheme, createDarkTheme } from '@fluentui/react-components';

// Define the blue brand ramp
const customBrandRamp = {
  10: '#001F3F', // Dark navy blue
  20: '#003366',
  30: '#004080',
  40: '#00509E',
  50: '#005EB8', // Medium blue
  60: '#0078D4', // Primary blue (VS Code main color)
  70: '#339CFF',
  80: '#66B8FF',
  90: '#99D1FF',
  100: '#CCE9FF', // Light blue
  110: '#E5F4FF',
  120: '#F0F8FF',
  130: '#F7FCFF',
  140: '#FBFDFF',
  150: '#FEFEFF',
  160: '#FFFFFF', // White
};

// Create light theme
export const customLightTheme = createLightTheme(customBrandRamp, {
  fontFamily: "'Segoe UI', Consolas, 'Courier New', monospace",
  fontSizeBase: '14px',
});

// Create dark theme with dark background
export const customDarkTheme = createDarkTheme(customBrandRamp, {
  fontFamily: "'Segoe UI', Consolas, 'Courier New', monospace",
  fontSizeBase: '14px',
  global: {
    color: {
      background: '#1E1E1E', // Dark background color, similar to VS Code
      backgroundHover: '#252526', // Slightly lighter hover background
      backgroundPressed: '#2D2D2D', // Pressed state
    },
  },
});
