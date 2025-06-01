import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

export const DiagnosticViewer = ({ output }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const [height, setHeight] = useState(170); // initial height

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const viewerTop = viewerRef.current.getBoundingClientRect().top;
      const viewerBottom = viewerRef.current.getBoundingClientRect().bottom;

      // (viewerTop-containerTop) is the offset having the border and title bar
      const newHeight = viewerBottom - e.clientY - (viewerTop - containerTop);
      setHeight(Math.max(80, newHeight)); // minimum height
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDragging = (e) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const iconMap = {
    info: (
      <Info
        style={{
          color: '#3B82F6',
          marginRight: '2px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ), // blue-500
    warn: (
      <AlertTriangle
        style={{
          color: '#E69700',
          marginRight: '2px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ), // yellow-500
    error: (
      <XCircle
        style={{
          color: '#EF4444',
          marginRight: '2px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ), // red-500
  };

  return (
    <div style={{ margin: '5px' }}>
      {/* Drag handle above border */}
      <div
        onMouseDown={startDragging}
        style={{
          height: '2px',
          cursor: 'row-resize',
          backgroundColor: '#ccc',
          marginBottom: '2px',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
        title="Drag to resize"
      />

      {/* Main container */}
      <div
        className="diagnostic-viewer"
        ref={containerRef}
        style={{
          border: '1px solid #ccc',
          borderRadius: '0px',
          padding: '5px',
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

        <div
          ref={viewerRef}
          style={{
            backgroundColor: '#f5f5f5',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '0px',
            height: `${height}px`,
            overflowY: 'scroll',
            fontSize: '14px',
            margin: 0,
          }}
        >
          {output.map((entry, idx) => (
            <div key={idx} className="flex items-start">
              {iconMap[entry.type] || iconMap.info}
              <span>{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticViewer;
