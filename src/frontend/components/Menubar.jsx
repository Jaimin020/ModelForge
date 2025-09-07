import React from 'react';
import {
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';

function Menubar() {
  menuTriggerStyle = { padding: '0 12px', cursor: 'pointer' };
  return (
    <div
      style={{ display: 'flex', backgroundColor: '#f0f0f0', padding: '4px' }}
    >
      <Menu>
        <MenuTrigger>
          <div style={menuTriggerStyle}>File</div>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>New</MenuItem>
            <MenuItem>Open</MenuItem>
            <MenuItem>Save</MenuItem>
            <MenuItem>Exit</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <div style={menuTriggerStyle}>Edit</div>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Cut</MenuItem>
            <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem>
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <div style={menuTriggerStyle}>View</div>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Zoom In</MenuItem>
            <MenuItem>Zoom Out</MenuItem>
            <MenuItem>Reset Zoom</MenuItem>
            <MenuItem>Toggle Fullscreen</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Menu>
        <MenuTrigger>
          <div style={menuTriggerStyle}>Help</div>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem>Documentation</MenuItem>
            <MenuItem>About</MenuItem>
            <MenuItem>Check for Updates</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}

export default Menubar;
