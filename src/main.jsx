import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import Navbar from './components/navbar'; // Import the Navbar component
import MoveAnalyzer from './components/MoveAnalyzer';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Navbar />
    <div className="container">
      {/* <div className="analyzer">
        <MoveAnalyzer />
      </div> */}
      <div className="chess-app">
        <App />
      </div>
    </div>
  </React.StrictMode>
);
