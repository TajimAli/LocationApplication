import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CityForm = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [cityName, setCityName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editCityId, setEditCityId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries();
        fetchCities();
        fetchState();
        fetchDistrict();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/Country');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setError('Failed to fetch countries.');
        }
    };

    const fetchState = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/State');
            setStates(response.data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setError('Failed to fetch countries.');
        }
    };

    const fetchDistrict = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/District');
            setDistricts(response.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setError('Failed to fetch districts.');
        }
    };

    const fetchStates = async (countryId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
            setStates(response.data);
            setSelectedStateId('');
            setDistricts([]);
            setSelectedDistrictId('');
        } catch (error) {
            console.error('Error fetching states:', error);
            setError('Failed to fetch states.');
        }
    };

    const fetchDistricts = async (stateId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/District/byState/${stateId}`);
            setDistricts(response.data);
            setSelectedDistrictId('');
        } catch (error) {
            console.error('Error fetching districts:', error);
            setError('Failed to fetch districts.');
        }
    };

    const fetchCities = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/City');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
            setError('Failed to fetch cities.');
        }
    };

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setSelectedCountryId(countryId);
        fetchStates(countryId);
    };

    const handleStateChange = (e) => {
        const stateId = e.target.value;
        setSelectedStateId(stateId);
        fetchDistricts(stateId);
    };

    const resetForm = () => {
        setCityName('');
        setSelectedDistrictId('');
        setSelectedStateId('');
        setSelectedCountryId('');
        setEditMode(false);
        setEditCityId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            countryId: selectedCountryId,
            stateId: selectedStateId,
            districtId: selectedDistrictId,
            cityName,
        };

        try {
            if (editMode) {
                await axios.put(`https://localhost:7116/api/City/${editCityId}`, { ...dataToSend, id: editCityId });
            } else {
                await axios.post('https://localhost:7116/api/City', dataToSend);
            }
            resetForm();
            fetchCities();
        } catch (error) {
            console.error('Error during request:', error);
            setError('Error: ' + (error.response?.data?.message || 'Network error. Please try again.'));
        }
    };

    const handleEdit = (city) => {
        setSelectedCountryId(city.countryId);
        fetchStates(city.countryId).then(() => {
            setSelectedStateId(city.stateId);
            fetchDistricts(city.stateId).then(() => {
                setSelectedDistrictId(city.districtId);
                setCityName(city.cityName);
            });
        });
        setEditMode(true);
        setEditCityId(city.id);
    }



    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7116/api/City/${id}`);
            fetchCities();
        } catch (error) {
            console.error('Error deleting city:', error);
            setError('Failed to delete city.');
        }
    };

    return (
        <div>
            <div className="container">
                <h2>Manage Cities</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Select Country:</label>
                            <select value={selectedCountryId} onChange={handleCountryChange} required>
                                <option value="">Select Country:</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.countryName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Select State:</label>
                            <select value={selectedStateId} onChange={handleStateChange} required>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.stateName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>Select District:</label>
                            <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.districtName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-12">
                            <label>City Name:</label>
                            <input
                                type="text"
                                value={cityName}
                                className="form-control"
                                onChange={(e) => setCityName(e.target.value)}
                                placeholder="City Name"
                                required
                            />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} City</button>
                </form>
            </div>

            <div>
                <h1>Cities Table</h1>
                <div className="tableData">
                    <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>No.</th>
                                {/* <th>ID</th> */}
                                <th>Country</th>
                                <th>State</th>
                                <th>District</th>
                                <th>City Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.length > 0 ? (
                                cities.map((city, index) => (
                                    <tr key={city.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{city.id}</td> */}
                                        <td>{countries.find(country => country.id === city.countryId)?.countryName}</td>
                                        <td>{states.find(state => state.id === city.stateId)?.stateName || city.stateId}</td>
                                        <td>{districts.find(district => district.id === city.districtId)?.districtName || city.districtId}</td>
                                        <td>{city.cityName}</td>
                                        <td>
                                            <button onClick={() => handleEdit(city)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
                                            <button onClick={() => handleDelete(city.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>No data Available</tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CityForm;











// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CityForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [selectedDistrictId, setSelectedDistrictId] = useState('');
//     const [cityName, setCityName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editCityId, setEditCityId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchCities();
//     }, []);

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//         } catch (error) {
//             console.error('Error fetching countries:', error);
//             setError('Failed to fetch countries.');
//         }
//     };

//     const fetchStates = async (countryId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
//             setStates(response.data);
//             setSelectedStateId('');
//             setDistricts([]);
//             setSelectedDistrictId('');
//         } catch (error) {
//             console.error('Error fetching states:', error);
//             setError('Failed to fetch states.');
//         }
//     };

//     const fetchDistricts = async (stateId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/District/byState/${stateId}`);
//             setDistricts(response.data);
//             setSelectedDistrictId('');
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/City');
//             setCities(response.data);
//         } catch (error) {
//             console.error('Error fetching cities:', error);
//             setError('Failed to fetch cities.');
//         }
//     };


//     //--------states for selected country--------
//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         fetchStates(countryId);
//     };

//     //------districts for selected state---------
//     const handleStateChange = (e) => {
//         const stateId = e.target.value;
//         setSelectedStateId(stateId);
//         fetchDistricts(stateId);
//     };

//     const resetForm = () => {
//         setCityName('');
//         setSelectedDistrictId('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditCityId(null);
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtId: selectedDistrictId,
//             cityName,
//         };

//         try {
//             if (editMode) {
//                 await axios.put(`https://localhost:7116/api/City/${editCityId}`, { ...dataToSend, id: editCityId });
//             } else {
//                 await axios.post('https://localhost:7116/api/City', dataToSend);
//             }
//             resetForm();
//             fetchCities();
//         } catch (error) {
//             console.error('Error during request:', error);
//             setError('Error: ' + (error.response?.data?.message || 'Network error. Please try again.'));
//         }
//     };

//     const handleEdit = (city) => {
//         setCityName(city.cityName);
//         setSelectedDistrictId(city.districtId);
//         setSelectedStateId(city.stateId);
//         setSelectedCountryId(city.countryId);
//         setEditMode(true);
//         setEditCityId(city.id);
//         fetchStates(city.countryId);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/City/${id}`);
//             fetchCities();
//         } catch (error) {
//             console.error('Error deleting city:', error);
//             setError('Failed to delete city.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Cities</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label>Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country:</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label>Select State:</label>
//                             <select value={selectedStateId} onChange={handleStateChange} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>Select District:</label>
//                             <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
//                                 <option value="">Select District</option>
//                                 {districts.map((district) => (
//                                     <option key={district.id} value={district.id}>{district.districtName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-12">
//                             <label>City Name:</label>
//                             <input
//                                 type="text"
//                                 value={cityName}
//                                 className="form-control"
//                                 onChange={(e) => setCityName(e.target.value)}
//                                 placeholder="City Name"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} City</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Cities Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District</th>
//                                 <th>City Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cities.map((city) => (
//                                 <tr key={city.id}>
//                                     <td>{city.id}</td>
//                                     <td>{countries.find(country => country.id === city.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === city.stateId)?.stateName || city.stateId}</td>
//                                     <td>{districts.find(district => district.id === city.districtId)?.districtName || city.districtId}</td>
//                                     <td>{city.cityName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(city)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(city.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CityForm;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CityForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [selectedDistrictId, setSelectedDistrictId] = useState('');
//     const [cityName, setCityName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editCityId, setEditCityId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchCities();
//     }, []);

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//         } catch (error) {
//             console.error('Error fetching countries:', error);
//             setError('Failed to fetch countries.');
//         }
//     };

//     const fetchStates = async (countryId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
//             setStates(response.data);
//             setSelectedStateId('');
//             setDistricts([]);
//             setSelectedDistrictId('');
//         } catch (error) {
//             console.error('Error fetching states:', error);
//             setError('Failed to fetch states.');
//         }
//     };

//     const fetchDistricts = async (stateId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/District/byState/${stateId}`);
//             setDistricts(response.data);
//             setSelectedDistrictId('');
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/City');
//             setCities(response.data);
//         } catch (error) {
//             console.error('Error fetching cities:', error);
//             setError('Failed to fetch cities.');
//         }
//     };

//     //--------states for selected country--------
//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         fetchStates(countryId);
//     };

//     //------districts for selected state---------
//     const handleStateChange = (e) => {
//         const stateId = e.target.value;
//         setSelectedStateId(stateId);
//         fetchDistricts(stateId);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtId: selectedDistrictId,
//             cityName,
//         };

//         try {
//             if (editMode) {
//                 await axios.put(`https://localhost:7116/api/City/${editCityId}`, { ...dataToSend, id: editCityId });
//             } else {
//                 await axios.post('https://localhost:7116/api/City', dataToSend);
//             }
//             resetForm();
//             fetchCities();
//         } catch (error) {
//             console.error('Error during request:', error);
//             setError('Error: ' + (error.response?.data?.message || 'Network error. Please try again.'));
//         }
//     };

//     const resetForm = () => {
//         setCityName('');
//         setSelectedDistrictId('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditCityId(null);
//         setError('');
//         setStates([]);
//         setDistricts([]);
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Cities</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label>Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country:</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label>Select State:</label>
//                             <select value={selectedStateId} onChange={handleStateChange} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>Select District:</label>
//                             <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
//                                 <option value="">Select District</option>
//                                 {districts.map((district) => (
//                                     <option key={district.id} value={district.id}>{district.districtName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-12">
//                             <label>City Name:</label>
//                             <input type="text" value={cityName} className="form-control" onChange={(e) => setCityName(e.target.value)} placeholder="City Name" required/>
//                         </div>
//                     </div>

//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} City</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Cities Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>No.</th>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District</th>
//                                 <th>City Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cities.map((city, index) => (
//                                 <tr key={city.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{city.id}</td>
//                                     <td>{countries.find(c => c.id === city.countryId)?.countryName || city.countryId}</td>
//                                     <td>{states.find(s => s.id === city.stateId)?.stateName || city.stateId}</td>
//                                     <td>{districts.find(d => d.id === city.districtId)?.districtName || city.districtId}</td>
//                                     <td>{city.cityName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(city)} className="btn btn-warning" style={{ marginRight: '5px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(city.id)} className="btn btn-danger">Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CityForm;












//------All Functionalitys working-----------
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CityForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [selectedDistrictId, setSelectedDistrictId] = useState('');
//     const [cityName, setCityName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editCityId, setEditCityId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchCities();
//     }, []);

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//         } catch (error) {
//             console.error('Error fetching countries:', error);
//             setError('Failed to fetch countries.');
//         }
//     };

//     const fetchStates = async (countryId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/State?countryId=${countryId}`);
//             setStates(response.data);
//         } catch (error) {
//             console.error('Error fetching states:', error);
//             setError('Failed to fetch states.');
//         }
//     };

//     const fetchDistricts = async (stateId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/District?stateId=${stateId}`);
//             setDistricts(response.data);
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const fetchCities = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/City');
//             setCities(response.data);
//         } catch (error) {
//             console.error('Error fetching cities:', error);
//             setError('Failed to fetch cities.');
//         }
//     };

//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         setSelectedStateId('');
//         setSelectedDistrictId('');
//         fetchStates(countryId);
//     };

//     const handleStateChange = (e) => {
//         const stateId = e.target.value;
//         setSelectedStateId(stateId);
//         setSelectedDistrictId('');
//         fetchDistricts(stateId);
//     };

//     const resetForm = () => {
//         setCityName('');
//         setSelectedDistrictId('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditCityId(null);
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtId: selectedDistrictId,
//             cityName,
//         };

//         try {
//             if (editMode) {
//                 dataToSend.id = editCityId;
//                 await axios.put(`https://localhost:7116/api/City/${editCityId}`, dataToSend);
//             } else {
//                 await axios.post('https://localhost:7116/api/City', dataToSend);
//             }
//             resetForm();
//             fetchCities();
//         } catch (error) {
//             console.error('Error during request:', error);
//             if (error.response) {
//                 setError(`Error: ${error.response.data.title || error.response.data.message || 'Unknown error'}`);
//             } else {
//                 setError('Network error. Please try again later.');
//             }
//         }
//     };

//     const handleEdit = (city) => {
//         setCityName(city.cityName);
//         setSelectedDistrictId(city.districtId);
//         setSelectedStateId(city.stateId);
//         setSelectedCountryId(city.countryId);
//         setEditMode(true);
//         setEditCityId(city.id);
//         fetchStates(city.countryId);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/City/${id}`);
//             fetchCities();
//         } catch (error) {
//             console.error('Error deleting city:', error);
//             setError('Failed to delete city.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Cities</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label>Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country:</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label>Select State:</label>
//                             <select value={selectedStateId} onChange={handleStateChange} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>Select District:</label>
//                             <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
//                                 <option value="">Select District</option>
//                                 {districts.map((district) => (
//                                     <option key={district.id} value={district.id}>{district.districtName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-12">
//                             <label>City Name:</label>
//                             <input
//                                 type="text"
//                                 value={cityName}
//                                 className="form-control"
//                                 onChange={(e) => setCityName(e.target.value)}
//                                 placeholder="City Name"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} City</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Cities Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District</th>
//                                 <th>City Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cities.map((city) => (
//                                 <tr key={city.id}>
//                                     <td>{city.id}</td>
//                                     <td>{countries.find(country => country.id === city.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === city.stateId)?.stateName || city.stateId}</td>
//                                     <td>{districts.find(district => district.id === city.districtId)?.districtName || city.districtId}</td>
//                                     <td>{city.cityName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(city)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(city.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CityForm;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CityForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [selectedDistrictId, setSelectedDistrictId] = useState('');
//     const [cityName, setCityName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editCityId, setEditCityId] = useState(null);

//     useEffect(() => {
//         fetchCountries();
//         fetchCities();
//     }, []);

//     const fetchCountries = async () => {
//         const response = await axios.get('https://localhost:7116/api/Country');
//         setCountries(response.data);
//     };

//     const fetchStates = async (countryId) => {
//         const response = await axios.get(`https://localhost:7116/api/State?countryId=${countryId}`);
//         setStates(response.data);
//     };

//     const fetchDistricts = async (stateId) => {
//         const response = await axios.get(`https://localhost:7116/api/District?stateId=${stateId}`);
//         setDistricts(response.data);
//     };

//     const fetchCities = async () => {
//         const response = await axios.get('https://localhost:7116/api/City');
//         setCities(response.data);
//     };

//     const handleCountryChange = (e) => {
//         setSelectedCountryId(e.target.value);
//         fetchStates(e.target.value);
//     };

//     const handleStateChange = (e) => {
//         setSelectedStateId(e.target.value);
//         fetchDistricts(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (editMode) {
//             await axios.put(`https://localhost:7116/City/${editCityId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityName });
//             setEditMode(false);
//         } else {
//             await axios.post('https://localhost:7116/api/City', { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityName });
//         }
//         setCityName('');
//         setSelectedDistrictId('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         fetchCities();
//     };

//     const handleEdit = (city) => {
//         setCityName(city.cityName);
//         setSelectedDistrictId(city.districtId);
//         setSelectedStateId(city.stateId);
//         setSelectedCountryId(city.countryId);
//         setEditMode(true);
//         setEditCityId(city.id);
//     };

//     const handleDelete = async (id) => {
//         await axios.delete(`https://localhost:7116/api/City/${id}`);
//         fetchCities();
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Cities</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Select State:</label>
//                             <select value={selectedStateId} onChange={handleStateChange} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Select District:</label>
//                             <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
//                                 <option value="">Select District</option>
//                                 {districts.map((district) => (
//                                     <option key={district.id} value={district.id}>{district.districtName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">City Name:</label>
//                             <input type="text" value={cityName} className="form-control" onChange={(e) => setCityName(e.target.value)} placeholder="City Name" required />
//                         </div>
//                     </div>
//                     <button type="submit">{editMode ? 'Update' : 'Add'} City</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>City Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '600px', marginLeft: '27%', alignItems: "center" }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District</th>
//                                 <th>City Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cities.map((city) => (
//                                 <tr key={city.id}>
//                                     <td>{city.id}</td>
//                                     <td>{countries.find(country => country.id === city.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === city.stateId)?.stateName}</td>
//                                     <td>{districts.find(district => district.id === city.districtId)?.districtName}</td>
//                                     <td>{city.cityName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(city)} style={{ width: "60px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(city.id)} style={{ width: "80px", height: "40px" }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CityForm;