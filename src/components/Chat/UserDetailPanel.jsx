import React from 'react';
import './UserDetailPanel.css';

const COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EF4444','#14B8A6'];
const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
const getColor    = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

const UserDetailPanel = ({ user, isMobile, onClose }) => {
  if (!user) return null;

  // Build info rows depending on whether it's a group, contact, or current user
  const buildInfo = () => {
    if (user.isGroup) {
      return [
        { label: 'Description', value: user.description || '—' },
        { label: 'Members',     value: `${user.members?.length || 0} members` },
      ];
    }
    if (user.isCurrentUser) {
      return [
        { label: 'Email',        value: user.email    || '—' },
        { label: 'Username',     value: user.username ? `@${user.username}` : '—' },
      ];
    }
    // Contact
    return [
      { label: 'Email',    value: user.email    || '—' },
      { label: 'Username', value: user.username ? `@${user.username}` : '—' },
    ];
  };

  const info = buildInfo();

  // Determine if we should show as fixed drawer (tablet/mobile)
  const className = [
    'user-detail-panel',
    isMobile ? 'user-detail-panel--open' : '',
  ].filter(Boolean).join(' ');

  // Avatar: show image if available, otherwise colored initials
  const renderAvatar = () => {
    if (user.image) {
      return (
        <img
          className="user-detail-panel__avatar"
          src={user.image}
          alt={user.name}
        />
      );
    }
    return (
      <div
        className="user-detail-panel__avatar"
        style={{ background: getColor(user.name) }}
      >
        {getInitials(user.name)}
      </div>
    );
  };

  const statusLabel = user.isGroup
    ? `${user.members?.length || 0} members`
    : user.isCurrentUser ? 'You' : 'Contact';

  return (
    <div className={className}>

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
        {renderAvatar()}
        <div className="user-detail-panel__name">{user.name}</div>
        <span className="user-detail-panel__status-badge">{statusLabel}</span>

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