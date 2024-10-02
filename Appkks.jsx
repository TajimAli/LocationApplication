import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CountryForm from './CompanyForm';
import StateForm from './StatesForm';
import DistrictForm from './DistrictsForm';
import CityForm from './CitysForm';
import FullAddressForm from './FullAddressForms'

function Appkkks() {
  return (
    <Router>
      <div>
        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/countries">Manage Countries</Link></li>
            <li><Link to="/states">Manage States</Link></li>
            <li><Link to="/districts">Manage Districts</Link></li>
            <li><Link to="/cities">Manage Cities</Link></li>
            <li><Link to="/fulladdresses">Manage Full Addresses</Link></li>
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









// import React from 'react';
// import { BrowserRouter as Router, Route, } from 'react-router-dom';
// import Header from './Header';
// import CountryForm from './CompanyForm';
// import StateForm from './StatesForm';
// import DistrictForm from './DistrictsForm';
// import CityForm from './CitysForm';
// import FullAddressForm from './FullAddressForms';

// const Appkkks = () => {
//     return (
//         <Router>
           
//                 <Header />
//                 <Route path="/country" component={CountryForm} />
//                 <Route path="/state" component={StateForm} />
//                 <Route path="/district" component={DistrictForm} />
//                 <Route path="/city" component={CityForm} />
//                 <Route path="/full-address" component={FullAddressForm} />
            
//         </Router>
//     );
// };

// export default Appkkks;
