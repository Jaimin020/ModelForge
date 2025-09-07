import React from 'react';
import './styles/ModalTemplate.css';
import { Settings } from 'lucide-react';

export function ModalTemplate({
  title = 'Title',
  body = 'Body',
  footer = 'Footer',
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <Settings size={16} />
          {title}
        </div>

        <div className="modal-body">
          <div className="modal-content">{body}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export default ModalTemplate;
