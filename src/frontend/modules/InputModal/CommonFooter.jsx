export const CommonFooter = ({ onSave, onClose }) => {
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
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        style={{
          padding: '6px 16px',
          fontSize: '13px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
    </>
  );
};
