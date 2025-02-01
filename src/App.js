import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlaceOfWorship from './placeOfWorship';
import About from './components/About';
import Welcome from './components/Welcome';
import Resources from './components/Resources';
import './styles/About.css';
import './styles/NavBar.css';
import './styles/Footer.css';
import './styles/About.css';
import './styles/Welcome.css';
import './styles/ToggleSwitch.css';
import './styles/DropdownStyles.css';
import './styles/ClearSelection.css';
import './styles/KpiBox.css';
import './styles/Resources.css';

const App = () => {
  const [data, setData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch data from the JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dive-with-data/exported_data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle dropdown toggle
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

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
          <Route path="/" element={<Welcome />} />
          <Route path="/placeOfWorship" element={<PlaceOfWorship data={data} />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Welcome />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">© {new Date().getFullYear()} Dive With Data Inc.</footer>
      </div>
    </Router>
  );
};

export default App;
