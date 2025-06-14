import React, { useState } from 'react';

export const ModalTemplate = ({
  title = 'Title',
  body = 'Body',
  footer = 'Footer',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '0px',
          width: '800px',
          maxHeight: '90vh',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '8px 12px',
            borderBottom: '2px solid #34495e',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34z" />
          </svg>
          {title}
        </div>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '0px',
            fontSize: '12px',
            margin: '5px',
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            {body}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
              borderTop: '1px solid #ddd',
              paddingTop: '10px',
            }}
          >
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};
