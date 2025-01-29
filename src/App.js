import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlaceOfWorship from './placeOfWorship';
import About from './components/About';
import Welcome from './components/Welcome';
import Resources from './components/Resources';
import './styles/About.css';
import './styles/Welcome.css';
import './styles/ToggleSwitch.css';
import './styles/DropdownStyles.css';
import './styles/ClearSelection.css';
import './styles/KpiBox.css';
import './styles/NavBar.css';
import './styles/Resources.css';
import './styles/Footer.css';

const App = () => {
  const [isOverseas, setIsOverseas] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch data from the JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dive-with-data/exported_data.json')
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData = await response.json();
        setData(jsonData);
        setCountries([...new Set(jsonData.map((item) => item.Country))]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter data based on user selections
  const filteredData = useMemo(() => {
    const filteredByCountry = selectedCountry
      ? data.filter((item) => item.Country === selectedCountry)
      : data;

    const filteredByLocation = filteredByCountry.filter((item) =>
      isOverseas
        ? item.Location_Type === 'French Overseas Territories'
        : item.Location_Type === 'Metropolitan France'
    );

    const filteredByRegion = selectedRegion
      ? filteredByLocation.filter((item) => item.Details.Region === selectedRegion)
      : filteredByLocation;

    const filteredByDepartment = selectedDepartment
      ? filteredByRegion.filter((item) => item.Details.Department_Name === selectedDepartment)
      : filteredByRegion;

    const filteredByCity = selectedCity
      ? filteredByDepartment.filter((item) => item.Details.City === selectedCity)
      : filteredByDepartment;

    // Dynamically populate regions based on the filtered data
    setRegions([...new Set(filteredByLocation.map((item) => item.Details.Region))]);

    return filteredByCity;
  }, [data, selectedCountry, isOverseas, selectedRegion, selectedDepartment, selectedCity]);

  // Toggle dropdown menu state
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-menu')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <Router basename="/dive-with-data">
      <div className="App">
        {/* Navigation Bar */}
        <nav className="nav">
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link dropdown-toggle"
                style={{ fontSize: '14px' }} // Adjust font size here

                onClick={() => toggleDropdown('Browse')}
                aria-expanded={openDropdown === 'Browse'}
              >
                Browse by Topic
              </button>
              {openDropdown === 'Browse' && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/placeOfWorship" className="dropdown-link">
                      Place of Worship
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link to="/resources" className="nav-link">Resources</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          {/* Catch-all Route */}
          <Route path="*" element={<Welcome />} />
          <Route
            path="/placeOfWorship"
            element={
              <PlaceOfWorship
                data={data}
                filteredData={filteredData}
                isOverseas={isOverseas}
                selectedRegion={selectedRegion}
                selectedDepartment={selectedDepartment}
                selectedCity={selectedCity}
              />
            }
          />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">© {new Date().getFullYear()} PoW Inc.</footer>
      </div>
    </Router>
  );
};

export default App;
