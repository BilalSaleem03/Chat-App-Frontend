import React, { useState, useEffect } from 'react';
import Sidebar from '../Chat/Sidebar.jsx';
import UserDetailPanel from '../Chat/UserDetailPanel.jsx';
import NewContactModal from '../Chat/NewContactModal.jsx';
import NewGroupModal from '../Chat/NewGroupModal.jsx';
import './Chat.css';

const CONTACTS = [
  { id: 1, name: 'Jack Tompshon', online: true,  color: '#6366F1' },
  { id: 2, name: 'Peg Legge',     online: false, color: '#EC4899' },
  { id: 3, name: 'Rita Bock',     online: true,  color: '#F59E0B' },
  { id: 4, name: 'Lucas Graham',  online: false, color: '#10B981' },
  { id: 5, name: 'Phil Turner',   online: true,  color: '#3B82F6' },
  { id: 6, name: 'Anna Teak',     online: false, color: '#8B5CF6' },
  { id: 7, name: 'Joyce Kim',     online: true,  color: '#EF4444' },
  { id: 8, name: 'Laura Prichet', online: false, color: '#14B8A6' },
];

const GROUPS = [
  { id: 101, name: 'Project Alpha', initials: 'PA', color: '#6366F1', isGroup: true },
  { id: 102, name: 'Tech Team',     initials: 'TM', color: '#F59E0B', isGroup: true },
  { id: 103, name: 'Team AI',       initials: 'AI', color: '#10B981', isGroup: true },
  { id: 104, name: 'Team Group',    initials: 'TG', color: '#3B82F6', isGroup: true },
];

const MESSAGES = [
  { id: 1, sent: false, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.', time: '1 day ago' },
  { id: 2, sent: true,  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.', time: '1 day ago' },
  { id: 3, sent: false, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.', time: '1 day ago' },
  { id: 4, sent: true,  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.', time: '1 day ago' },
  { id: 5, sent: false, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac augue eu odio tempor commodo. Nullam ut mattis eros. Cras ut orci nisi.', time: '1 day ago' },
  { id: 6, sent: true,  text: 'Lorem ipsum dolor sit amet', time: '1 day ago' },
];

const CURRENT_USER = { id: 0, name: 'John Will Palinsky', color: '#6366F1', isCurrentUser: true };
const getInitials  = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const Chat = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatListOpen,     setChatListOpen]     = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);
  const [activeTab,        setActiveTab]        = useState('chats');
  const [activeContact,    setActiveContact]    = useState(CONTACTS[0]);
  const [detailUser,       setDetailUser]       = useState(null);
  const [showNewContact,   setShowNewContact]   = useState(false);
  const [showNewGroup,     setShowNewGroup]     = useState(false);
  const [messageInput,     setMessageInput]     = useState('');

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w <= 680;
      setIsMobile(mobile);
      setSidebarCollapsed(w <= 900);
      // Close drawers on resize to desktop
      if (!mobile) { setChatListOpen(false); }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProfileClick = () => {
    setDetailUser(prev => prev?.isCurrentUser ? null : { ...CURRENT_USER });
  };

  const handleContactClick = (contact) => {
    setActiveContact(contact);
    setDetailUser(prev =>
      prev && !prev.isCurrentUser && prev.id === contact.id ? null : { ...contact }
    );
    if (isMobile) setChatListOpen(false);
  };

  const handleSend = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
  };

  const closeAllDrawers = () => {
    setChatListOpen(false);
    setDetailUser(null);
  };

  const list = activeTab === 'chats' ? CONTACTS : GROUPS;
  const showOverlay = isMobile && (chatListOpen || !!detailUser);

  return (
    <div className="chat-page">

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(v => !v)}
      />

      <div className="chat-main">

        {/* Navbar */}
        <header className="chat-navbar">
          <div className="chat-navbar__search">
            <svg className="chat-navbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search..." />
          </div>

          <div className="chat-navbar__actions">
            <button className="chat-navbar__icon-btn" aria-label="Tasks">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Language">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </button>
            <button className="chat-navbar__add-btn" onClick={() => setShowNewContact(true)} aria-label="Add contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button className="chat-navbar__profile" onClick={handleProfileClick}>
              <div className="chat-navbar__avatar" style={{ background: CURRENT_USER.color }}>
                {getInitials(CURRENT_USER.name)}
              </div>
              <div className="chat-navbar__profile-info">
                <div className="chat-navbar__profile-name">{CURRENT_USER.name}</div>
                <div className="chat-navbar__profile-role">Manager</div>
              </div>
              <svg className="chat-navbar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="chat-body">

          {/* Shared dim overlay for both drawers on mobile */}
          {showOverlay && (
            <div className="chat-list-overlay" onClick={closeAllDrawers} />
          )}

          {/* Chat list panel */}
          <div className={`chat-list-panel${isMobile && chatListOpen ? ' chat-list-panel--open' : ''}`}>
            <div className="chat-list-panel__header">
              <div className="chat-list-panel__title-row">
                <h2 className="chat-list-panel__title">Chat</h2>
                <button className="chat-list-panel__icon-btn" aria-label="Search chats">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </div>
              <div className="chat-list-panel__tabs">
                <button className={`chat-list-panel__tab${activeTab === 'chats' ? ' chat-list-panel__tab--active' : ''}`} onClick={() => setActiveTab('chats')}>Chats</button>
                <button className={`chat-list-panel__tab${activeTab === 'groups' ? ' chat-list-panel__tab--active' : ''}`} onClick={() => setActiveTab('groups')}>Groups</button>
              </div>
            </div>

            <div className="chat-list-panel__list">
              {list.map(item => (
                <div
                  key={item.id}
                  className={`chat-item${activeContact?.id === item.id ? ' chat-item--active' : ''}`}
                  onClick={() => handleContactClick(item)}
                >
                  <div className="chat-item__avatar-wrap">
                    <div className="chat-item__avatar-circle" style={{ background: item.color }}>
                      {item.isGroup ? item.initials : getInitials(item.name)}
                    </div>
                    {item.online && <span className="chat-item__online-dot" />}
                  </div>
                  <div className="chat-item__info">
                    <div className="chat-item__name">{item.name}</div>
                    <div className="chat-item__preview">Lorem ipsum dolor sit amet dolor</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="chat-list-panel__bottom-btn"
              onClick={() => activeTab === 'groups' ? setShowNewGroup(true) : setShowNewContact(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {activeTab === 'groups' ? 'New Group' : 'New Message'}
            </button>
          </div>

          {/* Message area */}
          <div className="message-area">
            <div className="message-area__header">
              <div className="message-area__header-avatar" style={{ background: activeContact?.color || '#6366F1' }}>
                {activeContact ? getInitials(activeContact.name) : '?'}
              </div>
              <div className="message-area__header-info">
                <div className="message-area__header-name">{activeContact?.name || 'Select a chat'}</div>
                <div className="message-area__header-status">{activeContact?.online ? 'Online 3 minutes ago' : 'Offline'}</div>
              </div>
              <div className="message-area__header-actions">
                <button className="message-area__header-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>
                <button className="message-area__header-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
                <button className="message-area__header-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="message-area__messages">
              {MESSAGES.map(msg => (
                <div key={msg.id} className={`message${msg.sent ? ' message--sent' : ' message--received'}`}>
                  {!msg.sent && (
                    <div className="message__avatar" style={{ background: activeContact?.color || '#6366F1' }}>
                      {activeContact ? getInitials(activeContact.name) : '?'}
                    </div>
                  )}
                  <div className="message__content">
                    <div className="message__bubble">{msg.text}</div>
                    <div className="message__time">{msg.time}</div>
                  </div>
                  {msg.sent && (
                    <div className="message__avatar" style={{ background: CURRENT_USER.color }}>
                      {getInitials(CURRENT_USER.name)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input bar — attach btn is OUTSIDE the input field */}
            <div className="message-area__input-bar">
              <input
                className="message-area__input"
                placeholder="Type your message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button className="message-area__action-btn" aria-label="Attach file">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <button className="message-area__send-btn" onClick={handleSend} aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* User detail panel — gets --open class on mobile */}
          {detailUser && (
            <UserDetailPanel
              user={detailUser}
              isMobile={isMobile}
              onClose={() => setDetailUser(null)}
            />
          )}

        </div>
      </div>

      {/* FAB — opens chat list drawer on mobile */}
      <button
        className="chat-list-fab"
        onClick={() => setChatListOpen(v => !v)}
        aria-label={chatListOpen ? 'Close chat list' : 'Open chat list'}
      >
        {chatListOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {showNewContact && (
        <NewContactModal onClose={() => setShowNewContact(false)} onSubmit={(d) => console.log(d)} />
      )}
      {showNewGroup && (
        <NewGroupModal onClose={() => setShowNewGroup(false)} onSubmit={(d) => console.log(d)} />
      )}

    </div>
  );
};

export default Chat;