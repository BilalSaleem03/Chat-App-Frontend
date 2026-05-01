import React, { useState } from 'react';
import './ModalPanel.css';

const NewContactModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit?.(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        <div className="modal-panel__header">
          <span className="modal-panel__title">New Contact</span>
          <button className="modal-panel__close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-panel__body">
          <div className="modal-panel__field">
            <span className="modal-panel__label">Image</span>
            <div className="modal-panel__image-row">
              <button className="modal-panel__image-btn" aria-label="Upload image">+</button>
              <span className="modal-panel__image-select">+ Select</span>
            </div>
          </div>

          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="nc-name">Name</label>
            <input
              className="modal-panel__input"
              id="nc-name"
              placeholder="Type name here..."
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="nc-email">Email</label>
            <input
              className="modal-panel__input"
              id="nc-email"
              type="email"
              placeholder="Type email here..."
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="modal-panel__footer">
          <button className="modal-panel__cancel-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancel
          </button>
          <button className="modal-panel__submit-btn" onClick={handleSubmit}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Create
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewContactModal;
