import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import sidebarChat from "/src/assets/sidebar-chat2.png"
import sidebarProduct from "/src/assets/sidebar-product.png"
import sidebarOrders from "/src/assets/sidebar-orders.png"
import sidebarCustomers from "/src/assets/sidebar-customers.png"
import sidebarSeller from "/src/assets/sidebar-seller.png"
import sidebarFile from "/src/assets/sidebar-file.png"
import productDown from "/src/assets/sidebar-product-down-arrow.png"
import toggleArrow from "/src/assets/toggle-arrow.svg"
import logoIcon from "/src/assets/Logo-icon.png"



const NAV_ITEMS = [
  { label: 'Chat System', active: true  },
  { label: 'Product',     hasArrow: true },
  { label: 'Orders' },
  { label: 'Customers' },
  { label: 'Seller' },
  { label: 'File Manager' },
];

/* Inline SVG icons — no emoji, no external files needed */
const IconChat = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   {/* <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> */}
  //   <path d="src/assets/sidebar-chat.svg"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarChat} alt="Chat Icon" />
);
const IconBox = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarProduct} alt="Product Icon" />
);
const IconCart = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
  //   <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarOrders} alt="Product Icon" />
);
const IconUser = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  //   <circle cx="12" cy="7" r="4"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarCustomers} alt="Product Icon" />
);
const IconStore = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  //   <polyline points="9 22 9 12 15 12 15 22"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarSeller} alt="Product Icon" />
);
const IconFolder = () => (
  // <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  // </svg>
  <img  className="sidebar__nav-icon" src={sidebarFile} alt="Product Icon" />
);
const IconChevronDown = () => (
  // <svg className="sidebar__nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  //   <polyline points="6 9 12 15 18 9"/>
  // </svg>
  <img style={{height:'18px' , width: '18px'}} className="sidebar__nav-icon" src={productDown} alt="Product Icon" />
);

const ICONS = [IconChat, IconBox, IconCart, IconUser, IconStore, IconFolder];

const Sidebar = ({ collapsed, onToggle }) => (
  <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>

    <div className="sidebar__header">
      {
        collapsed ? <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
                      <img style={{transform: 'scaleX(-1)' ,marginLeft: '1rem'}} src={toggleArrow} alt="arrow" />
                    </button>
        : <Link to="/" className="sidebar__logo">
            <span className="sidebar__logo-icon">
              <img src={logoIcon} alt="" aria-hidden="true" />
            </span>
            <span className="sidebar__logo-name">Tasky</span>
          </Link>
      }
       
      <button className="sidebar__toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <img src={toggleArrow} alt="arrow" />
      </button>
    </div>

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

    

  </aside>
);

export default Sidebar;
