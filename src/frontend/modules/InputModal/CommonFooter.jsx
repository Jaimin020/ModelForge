export function CommonFooter({ onSave, onClose }) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };
  return (
    <>
      <button
        onClick={onClose}
        style={{
          padding: '6px 16px',
          fontSize: '13px',
          backgroundColor: '#3c3c3c',
          color: '#cccccc',
          border: '1px solid #454545',
          cursor: 'pointer',
          borderRadius: '2px',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#4c4c4c')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#3c3c3c')}
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        style={{
          padding: '6px 16px',
          fontSize: '13px',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '2px',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0062a3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#007acc')}
      >
        Save
      </button>
    </>
  );
}
