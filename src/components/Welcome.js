import React from 'react';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Dive with Data</h1>
        <p>
          Your one-stop platform for exploring detailed insights about differents topics. Dive into rich data and discover everything you need to know!
        </p>
        <button 
          className="cta-button"
          onClick={() => window.location.href = '/placeOfWorship'} // Redirect to resources page
        >
          Get Started
        </button>
      </div>
      {/*
      <div className="welcome-image">
        <img 
          src="https://via.placeholder.com/600x400" 
          alt="Welcome illustration" 
        />
      </div>
      */}
    </div>
  );
};

export default Welcome;
