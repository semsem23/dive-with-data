import React, { createContext, useContext, useState } from 'react';

// Create the context
const FilterContext = createContext();

// Create a provider component
export const FilterProvider = ({ children }) => {
  const [isOverseas, setIsOverseas] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const clearSelections = () => {
    setSelectedRegion('');
    setSelectedDepartment('');
    setSelectedCity('');
  };

  return (
    <FilterContext.Provider
      value={{
        isOverseas,
        setIsOverseas,
        selectedRegion,
        setSelectedRegion,
        selectedDepartment,
        setSelectedDepartment,
        selectedCity,
        setSelectedCity,
        clearSelections,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the filter context
export const useFilter = () => useContext(FilterContext);
