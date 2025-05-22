import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ОКАК</h3>
            <p>Creating beautiful web applications with modern technologies</p>
          </div>
          
          <div className="footer-section">
            <h3>Навигация</h3>
            <ul className="footer-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/#projects">Проекты</Link></li>
              <li><Link to="/#about">Обо мне</Link></li>
              <li><Link to="/#skills">Навыки</Link></li>
              <li><Link to="/#contact">Контакты</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Connect</h3>
            <ul className="footer-links">
              <li><Link to="/#contact">Контакты</Link></li>
              <li><Link to="/github">GitHub</Link></li>
              <li><Link to="/linkedin">LinkedIn</Link></li>
              <li><Link to="/twitter">Twitter</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} ОКАК. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 