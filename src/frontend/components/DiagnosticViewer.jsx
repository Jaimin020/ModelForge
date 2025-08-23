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
            paddingBottom: '8px',
          }}
        >
          <span>Diagnostic Viewer</span>
          <button
            onClick={clearOutput}
            style={{
              fontSize: '11px',
              color: 'black',
              border: '1px solid grey',
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
