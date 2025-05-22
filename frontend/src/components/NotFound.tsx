import React from 'react';
import './NotFound.css';
import catImage from '../assets/cat.png';

const NotFound = () => {
  return (
    <div className="app">
        <div className="error">
            404
        </div>
        <div className="img">
            <img src={catImage} alt="cat" />
            <h1 className="okak">ОКАК</h1>
        </div>
    </div>
  );
};

export default NotFound; 