import React, { useState } from 'react';
import { ModalTemplate } from '../../components/ModalTemplate';

export function InputModalTemplate({
  onClose,
  title = 'Input Configuration',
  leftPanel,
  rightPanel,
  footer,
}) {
  const modalBody = (
    <div style={{ gap: '20px' }}>
      {leftPanel}
      {rightPanel}
    </div>
  );
  return <ModalTemplate title={title} body={modalBody} footer={footer} />;
}
