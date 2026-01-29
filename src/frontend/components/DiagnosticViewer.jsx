import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  BrushCleaning,
} from 'lucide-react';

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
    info: (
      <Info
        style={{
          color: '#3B82F6',
          marginRight: '4px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ),
    warn: (
      <AlertTriangle
        style={{
          color: '#E69700',
          marginRight: '4px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ),
    error: (
      <XCircle
        style={{
          color: '#EF4444',
          marginRight: '4px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ),
    success: (
      <CheckCircle
        style={{
          color: '#10B981',
          marginRight: '4px',
          position: 'relative',
          top: '2px',
        }}
        size={14}
      />
    ),
  };

  return (
    <div style={{ margin: '2px' }}>
      {/* Drag handle above border */}
      <div
        onMouseDown={startDragging}
        style={{
          height: '2px',
          cursor: 'row-resize',
          backgroundColor: '#454545',
          marginBottom: '1px',
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
          border: '1px solid #454545',
          borderRadius: '0px',
          padding: '2px',
          backgroundColor: '#252526',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            backgroundColor: '#333333',
            color: '#cccccc',
            padding: '4px 6px',
            borderBottom: '1px solid #454545',
            marginBottom: '2px',
          }}
        >
          <span>Diagnostic Viewer</span>
          <button
            onClick={clearOutput}
            style={{
              fontSize: '11px',
              color: '#cccccc',
              backgroundColor: '#3c3c3c',
              border: '1px solid #454545',
              padding: '2px 6px',
              cursor: 'pointer',
              borderRadius: '3px',
              float: 'right',
              position: 'relative',
              top: '-4px',
            }}
          >
            <span style={{ position: 'relative', top: '-2px' }}>Clear</span>
            <BrushCleaning
              style={{ marginLeft: '4px', position: 'relative', top: '1px' }}
              size={14}
            />
          </button>
        </div>

        <div
          ref={viewerRef}
          style={{
            backgroundColor: '#1e1e1e',
            color: '#cccccc',
            padding: '6px',
            border: '1px solid #454545',
            borderRadius: '0px',
            height: `${height}px`,
            overflowY: 'scroll',
            fontSize: '12px',
            margin: 0,
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
