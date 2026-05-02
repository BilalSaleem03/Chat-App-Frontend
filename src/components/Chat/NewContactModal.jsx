import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ModalPanel.css';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const NewContactModal = ({ onClose, onSubmit }) => {
  const [email,     setEmail]     = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [image,     setImage]     = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [looking,   setLooking]   = useState(false);
  const [error,     setError]     = useState('');
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEmailBlur = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setLooking(true);
    setFoundUser(null);
    setError('');
    try {
      const res = await axios.get(
        `${API}/users/find?email=${encodeURIComponent(email.trim().toLowerCase())}`,
        { withCredentials: true }
      );
      setFoundUser(res.data);
    } catch {
      setFoundUser(null);
    } finally {
      setLooking(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    setError('');
    setLoading(true);
    try {
      let res;
      if (image) {
        // Send as FormData only when image is selected
        const fd = new FormData();
        fd.append('email', email.trim().toLowerCase());
        fd.append('contactImage', image);
        res = await axios.post(`${API}/chat/contact`, fd, { withCredentials: true });
      } else {
        // No image — send plain JSON (faster, no multer needed)
        res = await axios.post(
          `${API}/chat/contact`,
          { email: email.trim().toLowerCase() },
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );
      }
      onSubmit?.(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const namePlaceholder = looking
    ? 'Looking up user...'
    : foundUser
      ? foundUser.name
      : 'Auto-filled after you enter email...';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>

        <div className="modal-panel__header">
          <span className="modal-panel__title">New Contact</span>
          <button className="modal-panel__close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-panel__body">

          <div className="modal-panel__field">
            <span className="modal-panel__label">Image (optional)</span>
            <div className="modal-panel__image-row">
              <div
                className="modal-panel__image-btn"
                onClick={() => fileRef.current && fileRef.current.click()}
                style={preview
                  ? { backgroundImage: 'url(' + preview + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
                  : {}
                }
              >
                {!preview && '+'}
              </div>
              <span
                className="modal-panel__image-select"
                onClick={() => fileRef.current && fileRef.current.click()}
              >
                +   Select
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="nc-name">Name</label>
            <input
              className="modal-panel__input"
              id="nc-name"
              placeholder={namePlaceholder}
              value={foundUser ? foundUser.name : ''}
              readOnly
              style={{ background: '#F8FAFC', color: foundUser ? '#0F172A' : '#94A3B8' }}
            />
          </div>

          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="nc-email">Email</label>
            <input
              className="modal-panel__input"
              id="nc-email"
              type="email"
              placeholder="Enter their registered email..."
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFoundUser(null); setError(''); }}
              onBlur={handleEmailBlur}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />
            {foundUser && (
              <span className="modal-panel__success">
                User found: {foundUser.name}
              </span>
            )}
          </div>

          {error && <p className="modal-panel__error">{error}</p>}
        </div>

        <div className="modal-panel__footer">
          <button className="modal-panel__cancel-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancel
          </button>
          <button className="modal-panel__submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="modal-panel__spinner" />
            ) : (
              <React.Fragment>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Create
              </React.Fragment>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewContactModal;