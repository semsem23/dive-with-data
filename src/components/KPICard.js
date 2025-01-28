import React from 'react';
import styled from 'styled-components';

const KPICard = ({ label, value, icon }) => {
  return (
    <Card>
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Card>
  );
};

const Card = styled.div`
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 2em;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const Value = styled.div`
  font-size: 1.5em;
  font-weight: bold;
`;

export default KPICard;
