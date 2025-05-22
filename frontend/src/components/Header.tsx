import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [logoText, setLogoText] = useState('');
  const fullLogoText = 'ОКАК';
  const location = useLocation();
  
  const [showConnectDropdown, setShowConnectDropdown] = useState(false);
  
  useEffect(() => {
    if (logoText.length < fullLogoText.length) {
      const timeout = setTimeout(() => {
        setLogoText(fullLogoText.slice(0, logoText.length + 1));
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [logoText]);

  // Handle navigation scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, title: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update page title
        document.title = `ОКАК | ${title}`;
      }
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowConnectDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Handle the Connect dropdown click
  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the document click from immediately closing the dropdown
    setShowConnectDropdown(!showConnectDropdown);
  };
  
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">{logoText}</span>
            <span className={`logo-cursor ${logoText.length === fullLogoText.length ? 'blink' : ''}`}></span>
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/" onClick={(e) => handleNavClick(e, 'home', 'Home')}>Home</Link></li>
            <li><Link to="/#projects" onClick={(e) => handleNavClick(e, 'projects', 'Projects')}>Projects</Link></li>
            <li><Link to="/#about" onClick={(e) => handleNavClick(e, 'about', 'About')}>About</Link></li>
            <li><Link to="/#skills" onClick={(e) => handleNavClick(e, 'skills', 'Skills')}>Skills</Link></li>
            <li><Link to="/#contact" onClick={(e) => handleNavClick(e, 'contact', 'Contact')}>Contact</Link></li>
            <li className="connect-dropdown">
              <button className="connect-button" onClick={handleConnectClick}>
                Connect <span className="dropdown-arrow">▾</span>
              </button>
              {showConnectDropdown && (
                <div className="connect-dropdown-content" onClick={(e) => e.stopPropagation()}>
                  <Link to="/github">GitHub</Link>
                  <Link to="/linkedin">LinkedIn</Link>
                  <Link to="/twitter">Twitter</Link>
                </div>
              )}
            </li>
            <li><Link to="/admin" className="admin-link">Admin</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 