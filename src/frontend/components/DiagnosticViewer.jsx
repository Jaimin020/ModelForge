import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  BrushCleaning,
} from 'lucide-react';

import './styles/DiagnosticViewer.css';

export function DiagnosticViewer({ output, clearOutput }) {
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
    info: <Info className="diag-icon info" />,
    warn: <AlertTriangle className="diag-icon warn" />,
    error: <XCircle className="diag-icon error" />,
    success: <CheckCircle className="diag-icon success" />,
  };

  return (
    <div style={{ margin: '5px' }}>
      {/* Drag handle above border */}
      <div
        onMouseDown={startDragging}
        className="drag-handle"
        title="Drag to resize"
      />

      {/* Main container */}
      <div
        className="diagnostic-viewer"
        ref={containerRef}
        className="diag-container"
      >
        <div className="diag-title-bar">
          <span>Diagnostic Viewer</span>
          <button onClick={clearOutput} className="clear-button">
            <BrushCleaning
              style={{ marginRight: '4px', position: 'relative', top: '1px' }}
              size={14}
            />
            <span style={{ position: 'relative', top: '-2px' }}>Clear</span>
          </button>
        </div>

        <div
          ref={viewerRef}
          className="diag-output"
          style={{
            height: `${height}px`,
          }}
        >
          {output.map((entry, idx) => (
            <div key={idx} className="flex items-start mb-1">
              {iconMap[entry.type] ? (
                <span className="mr-2 mt-0.5">{iconMap[entry.type]}</span>
              ) : null}
              <span dangerouslySetInnerHTML={{ __html: entry.message }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiagnosticViewer;
