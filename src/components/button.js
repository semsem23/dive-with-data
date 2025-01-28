import React from 'react';

export const Button = ({ children, className, onClick }) => (
  <button className={`button ${className}`} onClick={onClick}>
    {children}
  </button>
);
