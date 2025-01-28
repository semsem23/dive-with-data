// src/components/KpiBox.js
import React from 'react';
import './styles/KpiBox.css';

export const KpiBox = ({ title, value }) => {
  return (
    <div className="kpi-box">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
