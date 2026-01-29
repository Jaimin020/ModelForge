import React from 'react';
import { Link2, Trash2, Edit3, X } from 'lucide-react';

export function GraphToolbar({ 
  onAddEdge, 
  onEditEdge,
  onDelete,
  onBack,
  isEditMode 
}) {
  const buttonBaseStyle = {
    width: '36px',
    height: '36px',
    backgroundColor: '#2d2d30',
    border: '1px solid #3e3e42',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#cccccc',
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  };

  const buttonHoverStyle = {
    backgroundColor: '#3e3e42',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
    borderColor: '#4e4e52',
  };

  const disabledStyle = {
    ...buttonBaseStyle,
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  };

  const deleteButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#5a1f1f',
    borderColor: '#6b2929',
    color: '#ff6b6b',
  };

  const deleteButtonHoverStyle = {
    backgroundColor: '#6b2929',
    borderColor: '#7b3333',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(255, 107, 107, 0.3)',
    color: '#ff8787',
  };

  const backButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#b71c1c',
    borderColor: '#c62828',
    color: '#ffffff',
  };

  const backButtonHoverStyle = {
    backgroundColor: '#c62828',
    borderColor: '#d32f2f',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 6px rgba(183, 28, 28, 0.5)',
  };

  const handleMouseEnter = (e, hoverStyle) => {
    if (isEditMode) {
      Object.assign(e.currentTarget.style, hoverStyle);
    }
  };

  const handleMouseLeave = (e, baseStyle) => {
    if (isEditMode) {
      Object.assign(e.currentTarget.style, baseStyle);
    }
  };

  return (
    <div
      style={{
        width: '48px',
        backgroundColor: '#1e1e1e',
        borderRight: '1px solid #2d2d30',
        padding: '8px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <button
        onClick={onAddEdge}
        disabled={!isEditMode}
        style={isEditMode ? buttonBaseStyle : disabledStyle}
        title="Add Edge (Connect Layers)"
        onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
        onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
      >
        <Link2 size={18} strokeWidth={2} />
      </button>

      <button
        onClick={onEditEdge}
        disabled={!isEditMode}
        style={isEditMode ? buttonBaseStyle : disabledStyle}
        title="Edit Edge"
        onMouseEnter={(e) => handleMouseEnter(e, buttonHoverStyle)}
        onMouseLeave={(e) => handleMouseLeave(e, buttonBaseStyle)}
      >
        <Edit3 size={18} strokeWidth={2} />
      </button>

      <button
        onClick={onDelete}
        disabled={!isEditMode}
        style={isEditMode ? deleteButtonStyle : disabledStyle}
        title="Delete Selected"
        onMouseEnter={(e) => handleMouseEnter(e, deleteButtonHoverStyle)}
        onMouseLeave={(e) => handleMouseLeave(e, deleteButtonStyle)}
      >
        <Trash2 size={18} strokeWidth={2} />
      </button>

      {/* Separator */}
      <div style={{ 
        width: '28px', 
        height: '1px', 
        backgroundColor: '#3e3e42',
        margin: '8px 0',
        borderRadius: '1px'
      }} />

      <button
        onClick={onBack}
        disabled={!isEditMode}
        style={isEditMode ? backButtonStyle : disabledStyle}
        title="Cancel / Exit Edit Mode"
        onMouseEnter={(e) => handleMouseEnter(e, backButtonHoverStyle)}
        onMouseLeave={(e) => handleMouseLeave(e, backButtonStyle)}
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default GraphToolbar;
