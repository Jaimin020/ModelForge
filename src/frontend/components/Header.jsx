import React from 'react';
import { Stack, Text } from '@fluentui/react';

const Header = () => {
  const headerStyles = {
    root: {
      width: '100%',
      height: '60px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      zIndex: 100
    }
  };

  const titleStyles = {
    root: {
      color: 'skyblue',
      fontSize: '24px',
      fontWeight: '600'
    }
  };

  return (
    <Stack 
      horizontal 
      horizontalAlign="center" 
      verticalAlign="center" 
      styles={headerStyles}
    >
      <Text variant="large" styles={titleStyles}>
        DeepGUI
      </Text>
    </Stack>
  );
};

export default Header;
