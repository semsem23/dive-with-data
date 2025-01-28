import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);
