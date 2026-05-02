import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ModalPanel.css';

const API    = 'http://localhost:5000';
const COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EF4444','#14B8A6'];
const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
const getColor    = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

const NewGroupModal = ({ onClose, onSubmit }) => {
  const [form,      setForm]     = useState({ name: '', description: '' });
  const [image,     setImage]    = useState(null);
  const [preview,   setPreview]  = useState(null);
  const [contacts,  setContacts] = useState([]);
  const [selected,  setSelected] = useState([]);
  const [search,    setSearch]   = useState('');
  const [loading,   setLoading]  = useState(false);
  const [fetching,  setFetching] = useState(true);
  const [error,     setError]    = useState('');
  const fileRef = useRef(null);

  // Load contacts from existing direct conversations
  useEffect(() => {
    axios.get(`${API}/chat/conversations`, { withCredentials: true })
      .then(res => {
        const direct = res.data
          .filter(c => !c.isGroup && c.userId)
          .map(c => ({ id: c.userId, name: c.name, email: c.email }));
        setContacts(direct);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const toggleMember = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleSubmit = async () => {
    if (!form.name.trim())    { setError('Group name is required'); return; }
    if (selected.length === 0) { setError('Select at least one member'); return; }
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name',        form.name.trim());
      fd.append('description', form.description.trim());
      // Append each member ID separately — this is how multer receives arrays
      selected.forEach(id => fd.append('members', id));
      if (image) fd.append('groupImage', image);

      const res = await axios.post(`${API}/chat/group`, fd, {
        withCredentials: true,
      });
      onSubmit?.(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        <div className="modal-panel__header">
          <span className="modal-panel__title">New Group</span>
          <button className="modal-panel__close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-panel__body">

          {/* Image */}
          <div className="modal-panel__field">
            <span className="modal-panel__label">Image (optional)</span>
            <div className="modal-panel__image-row">
              <div
                className="modal-panel__image-btn"
                onClick={() => fileRef.current?.click()}
                style={preview ? { backgroundImage: `url(${preview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!preview && '+'}
              </div>
              <span className="modal-panel__image-select" onClick={() => fileRef.current?.click()}>+ Select</span>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </div>
          </div>

          {/* Name */}
          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="ng-name">Name</label>
            <input
              className="modal-panel__input"
              id="ng-name"
              placeholder="Type group name here..."
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="modal-panel__field">
            <label className="modal-panel__label" htmlFor="ng-desc">Description</label>
            <textarea
              className="modal-panel__textarea"
              id="ng-desc"
              placeholder="Type description here..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Members */}
          <div className="modal-panel__field">
            <span className="modal-panel__label">
              Add Members {selected.length > 0 && <span style={{ color: '#2563EB' }}>({selected.length} selected)</span>}
            </span>
            <div className="modal-panel__search-wrap">
              <svg className="modal-panel__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="modal-panel__search-input"
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="modal-panel__member-list">
              {fetching && <p className="modal-panel__hint">Loading contacts...</p>}
              {!fetching && contacts.length === 0 && (
                <p className="modal-panel__hint">No contacts yet. Add contacts first before creating a group.</p>
              )}
              {!fetching && filtered.map(member => (
                <div key={member.id} className="modal-panel__member-item" onClick={() => toggleMember(member.id)}>
                  <div className="modal-panel__member-avatar" style={{ background: getColor(member.name) }}>
                    {getInitials(member.name)}
                  </div>
                  <div className="modal-panel__member-info">
                    <div className="modal-panel__member-name">{member.name}</div>
                    <div className="modal-panel__member-role">{member.email}</div>
                  </div>
                  <input
                    type="checkbox"
                    className="modal-panel__member-checkbox"
                    checked={selected.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="modal-panel__error">{error}</p>}
        </div>

        <div className="modal-panel__footer">
          <button className="modal-panel__cancel-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Cancel
          </button>
          <button className="modal-panel__submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span className="modal-panel__spinner" />
              : <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Add Group
                </>
            }
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewGroupModal;