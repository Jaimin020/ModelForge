import React, { useState } from 'react';
import { useEffect, useRef } from 'react';

export const DiagnosticViewer = ({ output }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div
      className="diagnostic-viewer"
      style={{
        border: '1px solid #ccc',
        borderRadius: '0px',
        padding: '5px',
        margin: '5px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          backgroundColor: 'white',
          padding: '3px',
          borderBottom: '1px solid #ddd',
          marginBottom: '3px',
        }}
      >
        Diagnostic Viewer
      </div>
      <pre
        ref={viewerRef}
        style={{
          backgroundColor: '#f5f5f5',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '0px',
          height: '170px',
          overflowY: 'scroll',
          fontSize: '12px',
        }}
      >
        <div dangerouslySetInnerHTML={{__html: output}}></div>
      </pre>
    </div>
  );
};

export default DiagnosticViewer;
