import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Sidebar from '../Chat/Sidebar.jsx';
import UserDetailPanel from '../Chat/UserDetailPanel.jsx';
import NewContactModal from '../Chat/NewContactModal.jsx';
import NewGroupModal from '../Chat/NewGroupModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Chat.css';
import navbarLeft from '../../assets/navbar-left-icon.svg'
import navbarMessage from '../../assets/navbar-message.svg'
import navbarRing from '../../assets/navbar-ring.svg'
import navbarLanguage from '../../assets/navbar-language.png'
import sidebarDrop from '../../assets/sidebar-product-down-arrow.png'
import search from '../../assets/search.svg'


const API    = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';;
const COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EF4444','#14B8A6'];

const getInitials  = (name) => name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
const getColor     = (name) => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

// Renders image if available, otherwise colored initials circle
const Avatar = ({ name, image, size = 36, fontSize = 36 , className = '' }) => {
  const style = { width: size, height: size, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' };
  if (image) {
    return <img src={image} alt={name} style={style} className={className} />;
  }
  return (
    <div style={{ ...style, background: getColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSize + 'px', fontWeight: 700, color: '#fff' }} className={className}>
      {getInitials(name)}
    </div>
  );
};
const formatTime   = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs  = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1)  return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDay < 7)  return `${diffDay}d ago`;
  return d.toLocaleDateString();
};

const Chat = () => {
  const { user: authUser, accessToken } = useAuth();

  const CURRENT_USER = {
    id:            authUser?.id,
    name:          authUser?.name     || 'You',
    username:      authUser?.username || '',
    email:         authUser?.email    || '',
    image:         authUser?.image,    
    color:         getColor(authUser?.name),
    isCurrentUser: true,
  };

  // ── State ──────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatListOpen,     setChatListOpen]     = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);
  const [panelDrawer,      setPanelDrawer]      = useState(window.innerWidth <= 1100);
  const [activeTab,        setActiveTab]        = useState('chats');

  const [conversations,    setConversations]    = useState([]);   // all from API
  const [activeConv,       setActiveConv]       = useState(null); // selected conversation
  const [messages,         setMessages]         = useState([]);   // messages for activeConv
  const [messageInput,     setMessageInput]     = useState('');

  const [detailUser,       setDetailUser]       = useState(null);
  const [showNewContact,   setShowNewContact]   = useState(false);
  const [showNewGroup,     setShowNewGroup]     = useState(false);

  const [convsLoading,     setConvsLoading]     = useState(true);
  const [msgsLoading,      setMsgsLoading]      = useState(false);
  const [convsError,       setConvsError]       = useState('');

  const socketRef      = useRef(null);
  const messagesEndRef = useRef(null);
  const activeConvRef  = useRef(null); // always holds current activeConv.conversationId

  // ── Responsive ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 680);
      setPanelDrawer(w <= 1100);
      setSidebarCollapsed(w <= 900);
      if (w > 680)  setChatListOpen(false);
      if (w > 1100) setDetailUser(null);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Fetch conversations on mount ───────────────────────────
  useEffect(() => {
    const fetchConversations = async () => {
      setConvsLoading(true);
      setConvsError('');
      try {
        const res = await axios.get(`${API}/chat/conversations`, { withCredentials: true });
        setConversations(res.data);
      } catch (err) {
        setConvsError(err.response?.data?.error || 'Failed to load conversations.');
      } finally {
        setConvsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // ── Socket.IO setup ────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;

    // Disconnect any existing socket before creating a new one
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const socket = io(API, {
      path: '/socket.io/',
      withCredentials: true,
      auth: { token: accessToken },
    });
    socketRef.current = socket;

    socket.on('receive_message', (newMsg) => {
      setMessages(prev => {
        const alreadyExists = prev.some(m => m._id === newMsg._id);
        if (alreadyExists) return prev;
        return [...prev, newMsg];
      });
    });

    // Join personal room for unread badge updates
    socket.emit('join_user_room');

    socket.on('unread_updated', ({ conversationId }) => {
      const isViewing = activeConvRef.current === conversationId.toString();

      if (isViewing) {
        // User is looking at this chat right now — mark read, no badge
        axios.patch(
          `${API}/chat/conversations/${conversationId}/read`,
          {},
          { withCredentials: true }
        ).catch(() => {});
        return;
      }

      // User is not viewing this chat — show the badge
      setConversations(prev =>
        prev.map(c =>
          c.conversationId.toString() === conversationId.toString()
            ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
            : c
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  // ── Join room when active conversation changes ─────────────
  useEffect(() => {
    if (!activeConv) return;
    activeConvRef.current = activeConv.conversationId.toString();
    socketRef.current?.emit('join_room', activeConv.conversationId);
  }, [activeConv]);

  // ── Fetch messages when conversation selected ──────────────
  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      setMsgsLoading(true);
      setMessages([]);
      try {
        const res = await axios.get(
          `${API}/messages/messages/${activeConv.conversationId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setMsgsLoading(false);
      }
    };
    fetchMessages();
  }, [activeConv]);

  // ── Scroll to bottom when messages change ─────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Handlers ───────────────────────────────────────────────
  const handleConvClick = (conv) => {
    setActiveConv(conv);
    setDetailUser(prev =>
      prev && !prev.isCurrentUser && prev.id === conv.conversationId ? null : conv
    );
    if (isMobile) setChatListOpen(false);

    // Reset unread badge locally immediately
    if (conv.unreadCount > 0) {
      setConversations(prev =>
        prev.map(c =>
          c.conversationId.toString() === conv.conversationId.toString()
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
      // Tell backend to reset count in DB
      axios.patch(
        `${API}/chat/conversations/${conv.conversationId}/read`,
        {},
        { withCredentials: true }
      ).catch(() => {});
    }
  };

  const handleProfileClick = () => {
    setDetailUser(prev => prev?.isCurrentUser ? null : { ...CURRENT_USER });
  };

  const handleSend = () => {
    if (!messageInput.trim() || !activeConv) return;
    socketRef.current?.emit('send_message', {
      conversationId: activeConv.conversationId,
      text: messageInput.trim(),
    });
    setMessageInput('');
  };

  const handleNewContact = async (data) => {
    // Refresh conversations after creating a contact
    try {
      const res = await axios.get(`${API}/chat/conversations`, { withCredentials: true });
      setConversations(res.data);
    } catch {}
  };

  const handleNewGroup = async (data) => {
    try {
      const res = await axios.get(`${API}/chat/conversations`, { withCredentials: true });
      setConversations(res.data);
    } catch {}
  };

  const closeAllDrawers = () => {
    setChatListOpen(false);
    setDetailUser(null);
  };

  // ── Split conversations into chats vs groups ───────────────
  const chats  = conversations.filter(c => !c.isGroup);
  const groups = conversations.filter(c =>  c.isGroup);
  const list   = activeTab === 'chats' ? chats : groups;

  // Map userId → image from direct conversations
  // Used to show correct avatar in group messages
  const senderImageMap = {};
  chats.forEach(c => {
    if (c.userId && c.image) {
      senderImageMap[c.userId.toString()] = c.image;
    }
  });

  const showOverlay = (isMobile && chatListOpen) || (panelDrawer && !!detailUser);

  // ── Render ─────────────────────────────────────────────────
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
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg> */}
              <img src={navbarLeft} alt='Left Icon' style={{width: '24px', height: '24px'}} />
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Tasks">
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg> */}
              <img src={navbarMessage} alt='Message Icon' style={{width: '24px', height: '24px'}} />
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Notifications">
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg> */}
              <img src={navbarRing} alt='Ring Icon' style={{width: '24px', height: '24px'}} />
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Language">
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg> */}
              <img src={navbarLanguage} alt='Language Icon' style={{width: '24px', height: '24px'}} />
            </button>
            <button className="chat-navbar__add-btn" onClick={() => setShowNewContact(true)} aria-label="Add contact">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button className="chat-navbar__icon-btn" aria-label="Tasks">
              {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg> */}
              <div style={{width: '1.5px', height: '34px' , backgroundColor:'var(--grey-lght)'}}> </div>
            </button>
            <button className="chat-navbar__profile" onClick={handleProfileClick}>
              <Avatar name={CURRENT_USER.name} image={CURRENT_USER?.image} size={32} fontSize={15} className="chat-navbar__avatar" />
              <div className="chat-navbar__profile-info">
                <div className="chat-navbar__profile-name">{CURRENT_USER.name}</div>
                <div className="chat-navbar__profile-role">{CURRENT_USER.username || 'User'}</div>
              </div>
              {/* <svg className="chat-navbar__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg> */}
              <img style={{height:'18px' , width: '18px'}} className="sidebar__nav-icon" src={sidebarDrop} alt="Product Icon" />
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="chat-body">

          {showOverlay && (
            <div className="chat-list-overlay" onClick={closeAllDrawers} />
          )}

          {/* Chat list panel */}
          <div className={`chat-list-panel${isMobile && chatListOpen ? ' chat-list-panel--open' : ''}`}>
            <div className="chat-list-panel__header">
              <div className="chat-list-panel__title-row">
                <h2 className="chat-list-panel__title">Chat</h2>
                <button className="chat-list-panel__icon-btn" aria-label="Search">
                  {/* <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13" cy="11" r="8.5"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg> */}
                  <img src={search} alt='Search Icon' style={{width: '17px', height: '17px'}} />
                </button>
              </div>
              <div className="chat-list-panel__tabs">
                <button className={`chat-list-panel__tab${activeTab === 'chats' ? ' chat-list-panel__tab--active' : ''}`} onClick={() => setActiveTab('chats')}>Chats</button>
                <button className={`chat-list-panel__tab${activeTab === 'groups' ? ' chat-list-panel__tab--active' : ''}`} onClick={() => setActiveTab('groups')}>Groups</button>
              </div>
            </div>

            <div className="chat-list-panel__list">
              {convsLoading && (
                <div className="chat-list__state">Loading...</div>
              )}
              {!convsLoading && convsError && (
                <div className="chat-list__state chat-list__state--error">{convsError}</div>
              )}
              {!convsLoading && !convsError && list.length === 0 && (
                <div className="chat-list__state">
                  {activeTab === 'chats' ? 'No contacts yet. Add one!' : 'No groups yet. Create one!'}
                </div>
              )}
              {!convsLoading && list.map(conv => (
                <div
                  key={conv.conversationId}
                  className={`chat-item${activeConv?.conversationId === conv.conversationId ? ' chat-item--active' : ''}`}
                  onClick={() => handleConvClick(conv)}
                >
                  <div className="chat-item__avatar-wrap">
                    <Avatar name={conv.name} image={conv.image} size={40} fontSize={15} />
                  </div>
                  <div className="chat-item__info">
                    <div className="chat-item__name">{conv.name}</div>
                    <div className="chat-item__preview">
                      {conv.isGroup ? (conv.description || 'Group chat') : (conv.email || conv.username || '')}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="chat-item__badge">
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className='chat-list-panel__bottom-container'>
                <button
                    className="chat-list-panel__bottom-btn"
                    onClick={() => activeTab === 'groups' ? setShowNewGroup(true) : setShowNewContact(true)}>
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    {activeTab === 'groups' ? 'New Group' : 'New Message'}
                </button>
            </div>
          </div>

          {/* Message area */}
          <div className="message-area">

            {/* Header */}
            <div className="message-area__header">
              {activeConv ? (
                <>
                  <Avatar name={activeConv.name} image={activeConv.image} size={40} fontSize={15} className="message-area__header-avatar" />
                  <div className="message-area__header-info">
                    <div className="message-area__header-name">{activeConv.name}</div>
                    <div className="message-area__header-status">
                      {activeConv.isGroup ? `${activeConv.members?.length || 0} members` : activeConv.email || ''}
                    </div>
                  </div>
                </>
              ) : (
                <div className="message-area__header-info">
                  <div className="message-area__header-name message-area__header-name-no-convo-selected">Select a conversation</div>
                </div>
              )}
              <div className="message-area__header-actions">
                <button className="message-area__header-btn">
                  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </button>
                <button className="message-area__header-btn">
                  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="13" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
                <button className="message-area__header-btn">
                  <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="message-area__messages">
              {!activeConv && (
                <div className="message-area__empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48, color: '#CBD5E1', marginBottom: 12 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p>Select a conversation to start chatting</p>
                </div>
              )}

              {activeConv && msgsLoading && (
                <div className="message-area__empty">Loading messages...</div>
              )}

              {activeConv && !msgsLoading && messages.length === 0 && (
                <div className="message-area__empty">No messages yet. Say hello!</div>
              )}

              {activeConv && !msgsLoading && messages.map(msg => {
                // senderId is populated object { _id, name } or plain string fallback
                const senderIdStr = msg.senderId?._id?.toString() || msg.senderId?.toString();
                const isSent      = senderIdStr === CURRENT_USER.id?.toString();
                const senderName  = msg.senderId?.name || activeConv.name;
                // Use sender's own image, or look up from direct conversations map
                const senderImage = msg.senderId?.image
                  || senderImageMap[msg.senderId?._id?.toString()]
                  || null;

                return (
                  <div key={msg._id} className={`message${isSent ? ' message--sent' : ' message--received'}`}>
                    
                    <div className="message__content">
                        {!isSent && (
                        <Avatar name={senderName} image={senderImage} size={26} fontSize={15} className="message__avatar" />
                        )}
                        <div className="message__bubble">{msg.text}</div>
                        {isSent && (
                            <Avatar name={CURRENT_USER.name} image={CURRENT_USER?.image} size={26} fontSize={15} className="message__avatar" />
                        )}
                      {activeConv.isGroup && !isSent && (
                        <span className="message__sender-name">{senderName}</span>
                      )}
                    </div>
                    <div className="message__time">{formatTime(msg.createdAt)}</div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="message-area__input-bar">
              <div className='message-area__input-bar-container'>
                <input
                    className="message-area__input"
                    placeholder={activeConv ? 'Type your message...' : 'Select a conversation first'}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={!activeConv}
                />
                <button className="message-area__action-btn" aria-label="Attach file" disabled={!activeConv}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                </button>
              </div>
              <button className="message-area__send-btn" onClick={handleSend} aria-label="Send" disabled={!activeConv}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* User detail panel */}
          {detailUser && (
            <UserDetailPanel
              user={detailUser}
              isMobile={panelDrawer}
              onClose={() => setDetailUser(null)}
            />
          )}

        </div>
      </div>

      {/* FAB */}
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
        <NewContactModal
          onClose={() => setShowNewContact(false)}
          onSubmit={handleNewContact}
        />
      )}
      {showNewGroup && (
        <NewGroupModal
          onClose={() => setShowNewGroup(false)}
          onSubmit={handleNewGroup}
        />
      )}

    </div>
  );
};

export default Chat;