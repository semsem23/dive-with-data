import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Dive with Data</h1>
        <p>
          Your one-stop platform for exploring detailed insights about different topics. Dive into rich data and discover everything you need to know!
        </p>
        <button 
          className="cta-button"
          onClick={() => navigate('/placeOfWorship')}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;
