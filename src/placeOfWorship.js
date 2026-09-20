import React, { useState, useMemo, useEffect } from 'react';
import { KpiBox } from './KpiBox';
import { useKPIs } from './useKPIs';
import BubbleChartComponent from './components/BubbleChartComponent';
import BarChartComponent from './components/BarChartComponent';
import HeatMapComponent from './components/HeatMapComponent';
import DiversityChartComponent from './components/DiversityChartComponent';


const PlaceOfWorship = ({ data }) => {
  const [isOverseas, setIsOverseas] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [regions, setRegions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);


  const countryFiltered = useMemo(() => (
    selectedCountry ? data.filter(item => item.Country === selectedCountry) : data
  ), [data, selectedCountry]);

  const typeFiltered = useMemo(() => (
    countryFiltered.filter(item =>
      isOverseas
        ? item.Location_Type === 'French Overseas Territories'
        : item.Location_Type === 'Metropolitan France'
    )
  ), [countryFiltered, isOverseas]);

  const regionFiltered = useMemo(() => (
    selectedRegion
      ? typeFiltered.filter(item => item.Details?.Region === selectedRegion)
      : typeFiltered
  ), [typeFiltered, selectedRegion]);

  const departmentFiltered = useMemo(() => (
    selectedDepartment
      ? regionFiltered.filter(item => item.Details?.Department_Name === selectedDepartment)
      : regionFiltered
  ), [regionFiltered, selectedDepartment]);

  const filteredData = useMemo(() => (
    selectedCity
      ? departmentFiltered.filter(item => item.Details?.City === selectedCity)
      : departmentFiltered
  ), [departmentFiltered, selectedCity]);

  useEffect(() => {
    setRegions([...new Set(typeFiltered.map(item => item.Details?.Region))]);
  }, [typeFiltered]);

  useEffect(() => {
    // Derived from regionFiltered (not the fully-filtered data) so picking a
    // department doesn't shrink this list down to just that one department.
    const filteredDepartments = regionFiltered.map(item => item.Details?.Department_Name);
    setDepartments([...new Set(filteredDepartments)]);
    if (selectedDepartment && !filteredDepartments.includes(selectedDepartment)) {
      setSelectedDepartment('');
    }
  }, [regionFiltered, selectedDepartment]);

  useEffect(() => {
    // Derived from departmentFiltered (not the fully-filtered data) so picking a
    // city doesn't shrink this list down to just that one city.
    const filteredCities = departmentFiltered.map(item => item.Details?.City);
    setCities([...new Set(filteredCities)]);
    if (selectedCity && !filteredCities.includes(selectedCity)) {
      setSelectedCity('');
    }
  }, [departmentFiltered, selectedCity]);

  const kpis = useKPIs(filteredData);

  const clearSelections = () => {
    setSelectedCountry('');
    setSelectedRegion('');
    setSelectedDepartment('');
    setSelectedCity('');
  };

  const countries = [...new Set(data.map(item => item.Country))]; 

  return (
    <div className="App">


        <main className="container">
          <aside className="sidebar">
            <h3 style={{ marginBottom: '2rem' }}>Filters</h3> 
            <div className="filter-block">
              <div className="toggle-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isOverseas}
                    onChange={(e) => {
                      setIsOverseas(e.target.checked);
                      clearSelections();
                    }}
                  />
                  <span className="slider"></span>
                </label>
                <span>{isOverseas ? 'French Overseas Territories' : 'Metropolitan France'}</span>
              </div>

              {[{ label: "Country", options: countries, value: selectedCountry, setter: setSelectedCountry },
                { label: "Region", options: regions, value: selectedRegion, setter: setSelectedRegion },
                { label: "Department", options: departments, value: selectedDepartment, setter: setSelectedDepartment },
                { label: "City", options: cities, value: selectedCity, setter: setSelectedCity }
              ].map((filter, index) => (
                <div className="dropdown-container" key={index}>
                  <label>{filter.label}:</label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                  >
                    <option value="">{`Select ${filter.label}`}</option>
                    {filter.options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button className="clear-button" onClick={clearSelections}>
                Clear Selections
              </button>
            </div>
          </aside>

          <section className="content">
            <div className="top-content">
              <h1>Place of Worship Analysis</h1>
              <p>An overview of places of worship and diversity metrics.</p>
            </div>

            <div className="kpi-block" style={{ marginTop: '1rem' }}>
              <KpiBox title="Number of Places of Worship" value={kpis.placesOfWorship} />
              <KpiBox title="Average Place of Worship" value={kpis.averagePlaceOfWorship} />
              <KpiBox title="National Heritage Sites Registered" value={kpis.unescoRegistered} />
              <KpiBox title="Diversity Index" value={kpis.diversityIndex} />
            </div>

            <div className="chart-block">
              <div className="row">
                <div className="chart-container">
                  <BubbleChartComponent
                    data={countryFiltered}
                    isOverseas={isOverseas}
                    selectedRegion={selectedRegion}
                    selectedDepartment={selectedDepartment}
                    selectedCity={selectedCity}
                  />
                </div>
                <div className="chart-container">
                  <BarChartComponent
                    data={countryFiltered}
                    isOverseas={isOverseas}
                    selectedRegion={selectedRegion}
                    selectedDepartment={selectedDepartment}
                    selectedCity={selectedCity} />
                </div>
              </div>
              <div className="row" style={{ marginBottom: '3rem' }}>
                <div className="chart-container">
                  <HeatMapComponent
                    data={countryFiltered}
                    isOverseas={isOverseas}
                    selectedRegion={selectedRegion}
                    selectedDepartment={selectedDepartment}
                    selectedCity={selectedCity}
                  />
                </div>
                <div className="chart-container">
                  <DiversityChartComponent
                    data={countryFiltered}
                    isOverseas={isOverseas}
                    selectedRegion={selectedRegion}
                    selectedDepartment={selectedDepartment}
                    selectedCity={selectedCity}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
  );
};

export default PlaceOfWorship;
