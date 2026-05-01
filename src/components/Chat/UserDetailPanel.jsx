import React from 'react';
import './UserDetailPanel.css';

const getInitials = (name) =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const UserDetailPanel = ({ user, isMobile, onClose }) => {
  if (!user) return null;

  const info = user.isCurrentUser
    ? [
        { label: 'Email',        value: 'johnwill@mail.com' },
        { label: 'Phone Number', value: '+1 234 567 8900' },
        { label: 'Location',     value: 'New York, USA' },
        { label: 'Birthday',     value: '12 May 1990' },
        { label: 'Join Date',    value: '01 January 2023' },
      ]
    : [
        { label: 'Email',        value: `${user.name.split(' ')[0].toLowerCase()}@mail.com` },
        { label: 'Phone Number', value: '050 414 8778' },
        { label: 'Location',     value: 'New York, USA' },
        { label: 'Birthday',     value: '12 May 1992' },
        { label: 'Join Date',    value: '12 December 2023' },
      ];

  const className = [
    'user-detail-panel',
    isMobile ? 'user-detail-panel--open' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>

      {/* Close button — always visible top-right */}
      <button
        className="user-detail-panel__close"
        onClick={onClose}
        aria-label="Close panel"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className="user-detail-panel__cover" />
      <div className="user-detail-panel__body">
        <div
          className="user-detail-panel__avatar"
          style={{ background: user.color || '#6366F1' }}
        >
          {getInitials(user.name)}
        </div>
        <div className="user-detail-panel__name">{user.name}</div>
        <span className="user-detail-panel__status-badge">Online</span>
        <div className="user-detail-panel__divider" />
        <div className="user-detail-panel__info">
          {info.map(item => (
            <div key={item.label} className="user-detail-panel__info-item">
              <span className="user-detail-panel__info-label">{item.label}</span>
              <span className="user-detail-panel__info-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPanel;