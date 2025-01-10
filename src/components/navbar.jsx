import React from 'react';
import './styling/navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-logo">Chess Game</div>
      <div className="navbar-links">
        <a href="/" className="navbar-link">Home</a>
        <a href="#about" className="navbar-link">About</a>
        <a href="#settings" className="navbar-link">Settings</a>
        <a href="#help" className="navbar-link">Help</a>
      </div>
    </div>
  );
};

export default Navbar;
