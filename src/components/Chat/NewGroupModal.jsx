import React, { useState } from 'react';
import './ModalPanel.css';

const CONTACTS = [
  { id: 1, name: 'Jay Hargudson',  role: 'Project Manager', color: '#6366F1' },
  { id: 2, name: 'Mohammad Karim', role: 'Project Manager', color: '#EC4899' },
  { id: 3, name: 'John Bushmill',  role: 'Project Manager', color: '#F59E0B' },
  { id: 4, name: 'Laura Prichet',  role: 'Back End Developer', color: '#10B981' },
  { id: 5, name: 'Lisa Greg',      role: 'Tech Lead',       color: '#3B82F6' },
];

const getInitials = (name) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const NewGroupModal = ({ onClose, onSubmit }) => {
  const [form, setForm]           = useState({ name: '', description: '' });
  const [selected, setSelected]   = useState([]);
  const [search, setSearch]       = useState('');

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleMember = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit?.({ ...form, members: selected });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>

        <div className="modal-panel__header">
          <span className="modal-panel__title">New Group</span>
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
            <label className="modal-panel__label" htmlFor="ng-name">Name</label>
            <input
              className="modal-panel__input"
              id="ng-name"
              placeholder="Type name here..."
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>

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

          <div className="modal-panel__field">
            <span className="modal-panel__label">Search &amp; Add Members</span>
            <div className="modal-panel__search-wrap">
              <svg className="modal-panel__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="modal-panel__search-input"
                placeholder="Search Contact..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="modal-panel__member-list">
              {filtered.map(member => (
                <div
                  key={member.id}
                  className="modal-panel__member-item"
                  onClick={() => toggleMember(member.id)}
                >
                  <div
                    className="modal-panel__member-avatar"
                    style={{ background: member.color }}
                  >
                    {getInitials(member.name)}
                  </div>
                  <div className="modal-panel__member-info">
                    <div className="modal-panel__member-name">{member.name}</div>
                    <div className="modal-panel__member-role">{member.role}</div>
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
            Add Group
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewGroupModal;
