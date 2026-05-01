import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Chat System', active: true },
  { label: 'Product',     hasArrow: true },
  { label: 'Orders' },
  { label: 'Customers' },
  { label: 'Seller' },
  { label: 'File Manager' },
];

/* Inline SVG icons — no emoji, no external files needed */
const IconChat = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconBox = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const IconCart = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconUser = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconStore = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconFolder = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconChevronDown = () => (
  <svg className="sidebar__nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ICONS = [IconChat, IconBox, IconCart, IconUser, IconStore, IconFolder];

const Sidebar = ({ collapsed, onToggle }) => (
  <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>

    <Link to="/" className="sidebar__logo">
      <span className="sidebar__logo-icon">
        <img src="/src/assets/logo-icon.svg" alt="" aria-hidden="true" />
      </span>
      <span className="sidebar__logo-name">Tasky</span>
    </Link>

    <span className="sidebar__label">Main Menu</span>

    <nav className="sidebar__nav">
      {NAV_ITEMS.map((item, i) => {
        const Icon = ICONS[i];
        return (
          <div
            key={item.label}
            className={`sidebar__nav-item${item.active ? ' sidebar__nav-item--active' : ''}`}
          >
            <Icon />
            <span className="sidebar__nav-label">{item.label}</span>
            {item.hasArrow && <IconChevronDown />}
          </div>
        );
      })}
    </nav>

    <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {collapsed
          ? <polyline points="9 18 15 12 9 6" />
          : <polyline points="15 18 9 12 15 6" />
        }
      </svg>
    </button>

  </aside>
);

export default Sidebar;
