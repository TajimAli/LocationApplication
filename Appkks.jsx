import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CountryForm from './CountryForm';
import StateForm from './StateForm';
import DistrictForm from './DistrictForm';
import CityForm from './CityForm';
import FullAddressForm from './FullAddressForm';

function Appkkks() {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/countries">Countries</Link></li>
            <li><Link to="/states">Manage States</Link></li>
            <li><Link to="/districts">Manage Districts</Link></li>
            <li><Link to="/cities">Manage Cities</Link></li>
            <li><Link to="/fulladdresses">Full Addresses</Link></li>
          </ul>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/countries" element={<CountryForm />} />
          <Route path="/states" element={<StateForm />} />
          <Route path="/districts" element={<DistrictForm />} />
          <Route path="/cities" element={<CityForm />} />
          <Route path="/fulladdresses" element={<FullAddressForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Appkkks;