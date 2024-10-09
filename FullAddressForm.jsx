import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FullAddressForm = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    const [fullAddresses, setFullAddresses] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries();
        fetchState();
        fetchDistrict();
        fetchCity();
        fetchAddresses();

    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/Country');
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
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

    const fetchCity = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/City');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setError('Failed to fetch districts.');
        }
    };

    const fetchStates = async (countryId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
            setStates(response.data);
            resetDistrictAndCity();
        } catch (error) {
            console.error("Error fetching states:", error);
            setError('Failed to fetch states.');
        }
    };

    const fetchDistricts = async (stateId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/District/byState/${stateId}`);
            setDistricts(response.data);
            // resetCity();
        } catch (error) {
            console.error("Error fetching districts:", error);
            setError('Failed to fetch districts.');
        }
    };

    const fetchCities = async (districtId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/City/byDistrict/${districtId}`);
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
            setError('Failed to fetch cities.');
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/FullAddress');
            setFullAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            setError('Failed to fetch addresses.');
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

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        setSelectedDistrictId(districtId);
        fetchCities(districtId);
    };

    const handleCityChange = (e) => {
        setSelectedCityId(e.target.value);
    };

    const isValidAddressData = () => {
        return selectedCountryId && selectedStateId && selectedDistrictId && selectedCityId;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const addressData = {
            countryId: parseInt(selectedCountryId),
            stateId: parseInt(selectedStateId),
            districtId: parseInt(selectedDistrictId),
            cityId: parseInt(selectedCityId),
        };

        try {
            if (editMode) {
                await axios.put(`https://localhost:7116/api/FullAddress/${editAddressId}`, { ...addressData, id: editAddressId });
            } else {
                await axios.post('https://localhost:7116/api/FullAddress', addressData);
            }
            resetForm();
            fetchAddresses();
        } catch (error) {
            console.error('Error during request:', error);
            setError('Error: ' + (error.response?.data?.message || 'Network error. Please try again.'));
        }
    };

    const resetForm = () => {
        setSelectedCityId('');
        setSelectedDistrictId('');
        setSelectedStateId('');
        setSelectedCountryId('');
        resetDistrictAndCity();
        setEditMode(false);
        setEditAddressId(null);
        setError('');
    };

    const resetDistrictAndCity = () => {
        setDistricts([]);
        setCities([]);
        setSelectedDistrictId('');
        setSelectedCityId('');
    };

    // const resetCity = () => {
    //     setCities([]);
    //     setSelectedCityId('');
    // };

    const handleEdit = (address) => {
        setSelectedCountryId(address.countryId);
        fetchStates(address.countryId).then(() => {
            setSelectedStateId(address.stateId);
            fetchDistricts(address.stateId).then(() => {
                setSelectedDistrictId(address.districtId);
                fetchCities(address.districtId).then(() => {
                    setSelectedCityId(address.cityId);
                });
            });
        });
        setEditMode(true);
        setEditAddressId(address.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7116/api/FullAddress/${id}`);
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
            setError('Failed to delete address.');
        }
    };

    return (
        <div>
            <div className="container">
                <h2>Manage Full Addresses</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Select Country:</label>
                            <select value={selectedCountryId} onChange={handleCountryChange} required>
                                <option value="">Select Country</option>
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
                        <div className="form-group col-md-6">
                            <label>Select District:</label>
                            <select value={selectedDistrictId} onChange={handleDistrictChange} required>
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.id}>{district.districtName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label>Select City:</label>
                            <select value={selectedCityId} onChange={handleCityChange} required>
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>{city.cityName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} Full Address</button>
                </form>
            </div>
            <div>
                <h1>Full Address Table</h1>
                <div className="tableData">
                    <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>No.</th>
                                {/* <th>ID</th> */}
                                <th>Country</th>
                                <th>State</th>
                                <th>District</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fullAddresses.length > 0 ? (
                                fullAddresses.map((address, index) => (
                                    <tr key={address.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{address.id}</td> */}
                                        <td>{countries.find(country => country.id === address.countryId)?.countryName}</td>
                                        <td>{states.find(state => state.id === address.stateId)?.stateName || address.stateId}</td>
                                        <td>{districts.find(district => district.id === address.districtId)?.districtName || address.districtId}</td>
                                        <td>{cities.find(city => city.id === address.cityId)?.cityName || address.cityId}</td>
                                        <td>
                                            <button onClick={() => handleEdit(address)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
                                            <button onClick={() => handleDelete(address.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>No Data Available</tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FullAddressForm;










//--------Complete Working---------
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FullAddressForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [selectedDistrictId, setSelectedDistrictId] = useState('');
//     const [selectedCityId, setSelectedCityId] = useState('');
//     const [fullAddresses, setFullAddresses] = useState([]);
//     const [editMode, setEditMode] = useState(false);
//     const [editAddressId, setEditAddressId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchAddresses();
//     }, []);

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//         } catch (error) {
//             console.error("Error fetching countries:", error);
//             setError('Failed to fetch countries.');
//         }
//     };

//     const fetchStates = async (countryId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
//             setStates(response.data);
//             resetDistrictAndCity();
//         } catch (error) {
//             console.error("Error fetching states:", error);
//             setError('Failed to fetch states.');
//         }
//     };

//     const fetchDistricts = async (stateId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/District/byState/${stateId}`);
//             setDistricts(response.data);
//             // resetCity();
//         } catch (error) {
//             console.error("Error fetching districts:", error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const fetchCities = async (districtId) => {
//         try {
//             const response = await axios.get(`https://localhost:7116/api/City/byDistrict/${districtId}`);
//             setCities(response.data);
//         } catch (error) {
//             console.error("Error fetching cities:", error);
//             setError('Failed to fetch cities.');
//         }
//     };

//     const fetchAddresses = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/FullAddress');
//             setFullAddresses(response.data);
//         } catch (error) {
//             console.error("Error fetching addresses:", error);
//             setError('Failed to fetch addresses.');
//         }
//     };

//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         fetchStates(countryId);
//     };

//     const handleStateChange = (e) => {
//         const stateId = e.target.value;
//         setSelectedStateId(stateId);
//         fetchDistricts(stateId);
//     };

//     const handleDistrictChange = (e) => {
//         const districtId = e.target.value;
//         setSelectedDistrictId(districtId);
//         fetchCities(districtId);
//     };

//     const handleCityChange = (e) => {
//         setSelectedCityId(e.target.value);
//     };

//     const isValidAddressData = () => {
//         return selectedCountryId && selectedStateId && selectedDistrictId && selectedCityId;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const addressData = {
//             countryId: parseInt(selectedCountryId),
//             stateId: parseInt(selectedStateId),
//             districtId: parseInt(selectedDistrictId),
//             cityId: parseInt(selectedCityId),
//         };

//         try {
//             if (editMode) {
//                 await axios.put(`https://localhost:7116/api/FullAddress/${editAddressId}`, { ...addressData, id: editAddressId });
//             } else {
//                 await axios.post('https://localhost:7116/api/FullAddress', addressData);
//             }
//             resetForm();
//             fetchAddresses();
//         } catch (error) {
//             console.error('Error during request:', error);
//             setError('Error: ' + (error.response?.data?.message || 'Network error. Please try again.'));
//         }
//     };

//     const resetForm = () => {
//         setSelectedCityId('');
//         setSelectedDistrictId('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         resetDistrictAndCity();
//         setEditMode(false);
//         setEditAddressId(null);
//         setError('');
//     };

//     const resetDistrictAndCity = () => {
//         setDistricts([]);
//         setCities([]);
//         setSelectedDistrictId('');
//         setSelectedCityId('');
//     };

//     // const resetCity = () => {
//     //     setCities([]);
//     //     setSelectedCityId('');
//     // };

//     const handleEdit = (address) => {
//         setSelectedCountryId(address.countryId);
//         fetchStates(address.countryId).then(() => {
//             setSelectedStateId(address.stateId);
//             fetchDistricts(address.stateId).then(() => {
//                 setSelectedDistrictId(address.districtId);
//                 fetchCities(address.districtId).then(() => {
//                     setSelectedCityId(address.cityId);
//                 });
//             });
//         });
//         setEditMode(true);
//         setEditAddressId(address.id);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/FullAddress/${id}`);
//             fetchAddresses();
//         } catch (error) {
//             console.error("Error deleting address:", error);
//             setError('Failed to delete address.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Full Addresses</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label>Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country</option>
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
//                         <div className="form-group col-md-6">
//                             <label>Select District:</label>
//                             <select value={selectedDistrictId} onChange={handleDistrictChange} required>
//                                 <option value="">Select District</option>
//                                 {districts.map((district) => (
//                                     <option key={district.id} value={district.id}>{district.districtName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label>Select City:</label>
//                             <select value={selectedCityId} onChange={handleCityChange} required>
//                                 <option value="">Select City</option>
//                                 {cities.map((city) => (
//                                     <option key={city.id} value={city.id}>{city.cityName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} Full Address</button>
//                 </form>
//             </div>
//             <div>
//                 <h1>Full Address Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '800px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>No.</th>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District</th>
//                                 <th>City</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {fullAddresses.map((address, index) => (
//                                 <tr key={address.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{address.id}</td>
//                                     <td>{countries.find(country => country.id === address.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === address.stateId)?.stateName || address.stateId}</td>
//                                     <td>{districts.find(district => district.id === address.districtId)?.districtName || address.districtId}</td>
//                                     <td>{cities.find(city => city.id === address.cityId)?.cityName || address.cityId}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(address)} className="btn btn-warning" style={{ marginRight: '5px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(address.id)} className="btn btn-danger">Delete</button>
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

// export default FullAddressForm;