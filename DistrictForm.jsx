import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DistrictForm = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editDistrictId, setEditDistrictId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries();
        fetchDistricts();
        fetchState();
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

    const fetchStates = async (countryId) => {
        try {
            const response = await axios.get(`https://localhost:7116/api/State/byCountry/${countryId}`);
            setStates(response.data);
        } catch (error) {
            console.error('Error fetching states:', error);
            setError('Failed to fetch states.');
        }
    };

    const fetchDistricts = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/District');
            setDistricts(response.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
            setError('Failed to fetch districts.');
        }
    };

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setSelectedCountryId(countryId);
        setSelectedStateId('');
        fetchStates(countryId);
    };

    const resetForm = () => {
        setDistrictName('');
        setSelectedStateId('');
        setSelectedCountryId('');
        setEditMode(false);
        setEditDistrictId(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            countryId: selectedCountryId,
            stateId: selectedStateId,
            districtName,
        };

        try {
            if (editMode) {
                dataToSend.id = editDistrictId;
                await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, dataToSend);
            } else {
                await axios.post('https://localhost:7116/api/District', dataToSend);
            }
            resetForm();
            fetchDistricts();
        } catch (error) {
            console.error('Error during request:', error);
            if (error.response) {
                setError(`Error: ${error.response.data.title || error.response.data.message || 'Unknown error'}`);
            } else {
                setError('Network error. Please try again later.');
            }
        }
    };

    const handleEdit = (district) => {
        setDistrictName(district.districtName);
        setSelectedStateId(district.stateId);
        setSelectedCountryId(district.countryId);
        setEditMode(true);
        setEditDistrictId(district.id);
        fetchStates(district.countryId);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7116/api/District/${id}`);
            fetchDistricts();
        } catch (error) {
            console.error('Error deleting district:', error);
            setError('Failed to delete district.');
        }
    };

    return (
        <div>
            <div className="container">
                <h2>Manage Districts</h2>
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
                            <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.id} value={state.id}>{state.stateName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label>District Name:</label>
                            <input type="text" value={districtName} className="form-control" onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} District</button>
                </form>
            </div>

            <div>
                <h1>Districts Table</h1>
                <div className="tableData">
                    <table border="1" className="table" style={{ width: '600px', margin: '20px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>No.</th>
                                {/* <th>ID</th> */}
                                <th>Country</th>
                                <th>State</th>
                                <th>District Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {districts.length > 0 ? (
                                districts.map((district, index) => (
                                    <tr key={district.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{district.id}</td> */}
                                        <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
                                        <td>{states.find(state => state.id === district.stateId)?.stateName || district.stateId}</td>
                                        <td>{district.districtName}</td>
                                        <td>
                                            <button onClick={() => handleEdit(district)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
                                            <button onClick={() => handleDelete(district.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
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

export default DistrictForm;











//--All working----
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DistrictForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [districtName, setDistrictName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editDistrictId, setEditDistrictId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchDistricts();
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

//     const fetchDistricts = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/District');
//             setDistricts(response.data);
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         setSelectedStateId('');
//         fetchStates(countryId);
//     };

//     const resetForm = () => {
//         setDistrictName('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditDistrictId(null);
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtName,
//         };

//         try {
//             if (editMode) {
//                 dataToSend.id = editDistrictId;
//                 const response = await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, dataToSend);
//                 console.log('District updated successfully:', response.data);
//             } else {
//                 const response = await axios.post('https://localhost:7116/api/District', dataToSend);
//                 console.log('District added successfully:', response.data);
//             }
//             resetForm();
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error during request:', error);
//             if (error.response) {
//                 setError(`Error: ${error.response.data.title || error.response.data.message || 'Unknown error'}`);
//             } else {
//                 setError('Network error. Please try again later.');
//             }
//         }
//     };

//     const handleEdit = (district) => {
//         setDistrictName(district.districtName);
//         setSelectedStateId(district.stateId);
//         setSelectedCountryId(district.countryId);
//         setEditMode(true);
//         setEditDistrictId(district.id);
//         fetchStates(district.countryId);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/District/${id}`);
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error deleting district:', error);
//             setError('Failed to delete district.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Districts</h2>
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
//                             <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>District Name:</label>
//                             <input type="text" value={districtName} className="form-control" onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} District</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Districts Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '600px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {districts.map((district) => (
//                                 <tr key={district.id}>
//                                     <td>{district.id}</td>
//                                     <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === district.stateId)?.stateName || district.stateId}</td>
//                                     <td>{district.districtName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(district)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(district.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
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

// export default DistrictForm;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DistrictForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [districtName, setDistrictName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editDistrictId, setEditDistrictId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchDistricts();
//     }, []);

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//             console.log('Fetched Countries:', response.data);
//         } catch (error) {
//             console.error('Error fetching countries:', error);
//             setError('Failed to fetch countries.');
//         }
//     };

//     const fetchStates = async (countryId) => {
//         if (!countryId) {
//             setStates([]);
//             return;
//         }
//         try {
//             const response = await axios.get(`https://localhost:7116/api/State?countryId=${countryId}`);
//             const filteredStates = response.data.filter(state => state.countryId === countryId);
//             setStates(filteredStates);
//             console.log(`Fetched States for Country ID ${countryId}:`, filteredStates);
//             setSelectedStateId('');
//         } catch (error) {
//             console.error('Error fetching states:', error);
//             setError('Failed to fetch states.');
//         }
//     };

//     const fetchDistricts = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/District');
//             setDistricts(response.data);
//             console.log('Fetched Districts:', response.data);
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         fetchStates(countryId);
//     };

//     const resetForm = () => {
//         setDistrictName('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditDistrictId(null);
//         setError('');
//         setStates([]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtName,
//         };
//         try {
//             if (editMode) {
//                 dataToSend.id = editDistrictId;
//                 const response = await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, dataToSend);
//                 console.log('District updated successfully:', response.data);
//             } else {
//                 const response = await axios.post('https://localhost:7116/api/District', dataToSend);
//                 console.log('District added successfully:', response.data);
//             }
//             resetForm();
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error during request:', error);
//             if (error.response) {
//                 setError(`Error: ${error.response.data.title || error.response.data.message || 'Unknown error'}`);
//             } else {
//                 setError('Network error. Please try again later.');
//             }
//         }
//     };

//     const handleEdit = (district) => {
//         setDistrictName(district.districtName);
//         setSelectedStateId(district.stateId);
//         setSelectedCountryId(district.countryId);
//         setEditMode(true);
//         setEditDistrictId(district.id);
//         fetchStates(district.countryId);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/District/${id}`);
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error deleting district:', error);
//             setError('Failed to delete district.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Districts</h2>
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
//                             <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>District Name:</label>
//                             <input
//                                 type="text"
//                                 value={districtName}
//                                 className="form-control"
//                                 onChange={(e) => setDistrictName(e.target.value)}
//                                 placeholder="District Name"
//                                 required
//                             />
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">
//                         {editMode ? 'Update' : 'Add'} District
//                     </button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Districts Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '100%', marginTop: '20px' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {districts.map((district) => (
//                                 <tr key={district.id}>
//                                     <td>{district.id}</td>
//                                     <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === district.stateId)?.stateName || district.stateId}</td>
//                                     <td>{district.districtName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(district)} className="btn btn-warning" style={{ marginRight: '5px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(district.id)} className="btn btn-danger">Delete</button>
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

// export default DistrictForm;









//----all functionalitys Is Working-------
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DistrictForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [districtName, setDistrictName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editDistrictId, setEditDistrictId] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchCountries();
//         fetchDistricts();
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

//     const fetchDistricts = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/District');
//             setDistricts(response.data);
//         } catch (error) {
//             console.error('Error fetching districts:', error);
//             setError('Failed to fetch districts.');
//         }
//     };

//     const handleCountryChange = (e) => {
//         const countryId = e.target.value;
//         setSelectedCountryId(countryId);
//         setSelectedStateId('');
//         fetchStates(countryId);
//     };

//     const resetForm = () => {
//         setDistrictName('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         setEditMode(false);
//         setEditDistrictId(null);
//         setError('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const dataToSend = {
//             countryId: selectedCountryId,
//             stateId: selectedStateId,
//             districtName,
//         };

//         try {
//             if (editMode) {
//                 dataToSend.id = editDistrictId;
//                 const response = await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, dataToSend);
//                 console.log('District updated successfully:', response.data);
//             } else {
//                 const response = await axios.post('https://localhost:7116/api/District', dataToSend);
//                 console.log('District added successfully:', response.data);
//             }
//             resetForm();
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error during request:', error);
//             if (error.response) {
//                 setError(`Error: ${error.response.data.title || error.response.data.message || 'Unknown error'}`);
//             } else {
//                 setError('Network error. Please try again later.');
//             }
//         }
//     };

//     const handleEdit = (district) => {
//         setDistrictName(district.districtName);
//         setSelectedStateId(district.stateId);
//         setSelectedCountryId(district.countryId);
//         setEditMode(true);
//         setEditDistrictId(district.id);
//         fetchStates(district.countryId);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/District/${id}`);
//             fetchDistricts();
//         } catch (error) {
//             console.error('Error deleting district:', error);
//             setError('Failed to delete district.');
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Districts</h2>
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
//                             <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>District Name:</label>
//                             <input type="text" value={districtName} className="form-control" onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
//                         </div>
//                     </div>
//                     {error && <div className="alert alert-danger">{error}</div>}
//                     <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} District</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Districts Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '100%', marginTop: '20px' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {districts.map((district) => (
//                                 <tr key={district.id}>
//                                     <td>{district.id}</td>
//                                     <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === district.stateId)?.stateName || district.stateId}</td>
//                                     <td>{district.districtName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(district)} className="btn btn-warning" style={{ marginRight: '5px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(district.id)} className="btn btn-danger">Delete</button>
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

// export default DistrictForm;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DistrictForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [districtName, setDistrictName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editDistrictId, setEditDistrictId] = useState(null);

//     useEffect(() => {
//         fetchCountries();
//         fetchDistricts();
//     }, []);

//     const fetchCountries = async () => {
//         const response = await axios.get('https://localhost:7116/api/Country');
//         setCountries(response.data);
//     };

//     const fetchStates = async (countryId) => {
//         const response = await axios.get(`https://localhost:7116/api/State?countryId=${countryId}`);
//         setStates(response.data);
//     };

//     const fetchDistricts = async () => {
//         const response = await axios.get('https://localhost:7116/api/District');
//         setDistricts(response.data);
//     };

//     const handleCountryChange = (e) => {
//         setSelectedCountryId(e.target.value);
//         setSelectedStateId(''); // Reset state when country changes
//         fetchStates(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (editMode) {
//             await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtName });
//             setEditMode(false);
//         } else {
//             await axios.post('https://localhost:7116/api/District', { countryId: selectedCountryId, stateId: selectedStateId, districtName });
//         }
//         resetForm();
//         fetchDistricts();
//     };

//     const resetForm = () => {
//         setDistrictName('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//     };

//     const handleEdit = (district) => {
//         setDistrictName(district.districtName);
//         setSelectedStateId(district.stateId);
//         setSelectedCountryId(district.countryId);
//         setEditMode(true);
//         setEditDistrictId(district.id);
//         fetchStates(district.countryId); // Fetch states for the selected country
//     };

//     const handleDelete = async (id) => {
//         await axios.delete(`https://localhost:7116/api/District/${id}`);
//         fetchDistricts();
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Districts</h2>
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
//                             <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label>District Name:</label>
//                             <input type="text" value={districtName} className="form-control" onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
//                         </div>
//                     </div>
//                     <button type="submit">{editMode ? 'Update' : 'Add'} District</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Districts Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '600px', marginLeft: '27%', alignItems: "center" }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {districts.map((district) => (
//                                 <tr key={district.id}>
//                                     <td>{district.id}</td>
//                                     <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === district.stateId)?.stateName || district.stateId}</td>
//                                     <td>{district.districtName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(district)} style={{ width: "60px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(district.id)} style={{ width: "80px", height: "40px" }}>Delete</button>
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

// export default DistrictForm;











//-----------------Main Code---------
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DistrictForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [selectedStateId, setSelectedStateId] = useState('');
//     const [districtName, setDistrictName] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editDistrictId, setEditDistrictId] = useState(null);

//     useEffect(() => {
//         fetchCountries();
//         fetchDistricts();
//     }, []);

//     const fetchCountries = async () => {
//         const response = await axios.get('https://localhost:7116/api/Country');
//         setCountries(response.data);
//     };

//     const fetchStates = async (countryId) => {
//         const response = await axios.get(`https://localhost:7116/api/State?countryId=${countryId}`);
//         setStates(response.data);
//     };

//     const fetchDistricts = async () => {
//         const response = await axios.get('https://localhost:7116/api/District');
//         setDistricts(response.data);
//     };

//     const handleCountryChange = (e) => {
//         setSelectedCountryId(e.target.value);
//         fetchStates(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (editMode) {
//             await axios.put(`https://localhost:7116/api/District/${editDistrictId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtName });
//             setEditMode(false);
//         } else {
//             await axios.post('https://localhost:7116/api/District', { countryId: selectedCountryId, stateId: selectedStateId, districtName });
//         }
//         setDistrictName('');
//         setSelectedStateId('');
//         setSelectedCountryId('');
//         fetchDistricts();
//     };

//     const handleEdit = (district) => {
//         setDistrictName(district.districtName);
//         setSelectedStateId(district.stateId);
//         setSelectedCountryId(district.countryId);
//         setEditMode(true);
//         setEditDistrictId(district.id);
//     };

//     const handleDelete = async (id) => {
//         await axios.delete(`https://localhost:7116/api/District/${id}`);
//         fetchDistricts();
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Districts</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Select Country:</label>
//                             <select value={selectedCountryId} onChange={handleCountryChange} required>
//                                 <option value="">Select Country:</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Select State:</label>
//                             <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
//                                 <option value="">Select State</option>
//                                 {states.map((state) => (
//                                     <option key={state.id} value={state.id}>{state.stateName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label htmlFor="">District Name:</label>
//                             <input type="text" value={districtName} className="form-control" onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
//                         </div>
//                     </div>
//                     <button type="submit">{editMode ? 'Update' : 'Add'} District</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Districts Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '600px', marginLeft: '27%', alignItems: "center" }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State</th>
//                                 <th>District Name</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {districts.map((district) => (
//                                 <tr key={district.id}>
//                                     <td>{district.id}</td>
//                                     <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
//                                     <td>{states.find(state => state.id === district.stateId)?.stateName}</td>
//                                     <td>{district.districtName}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(district)} style={{ width: "60px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(district.id)} style={{ width: "80px", height: "40px" }}>Delete</button>
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

// export default DistrictForm;

//update countryName from countryId, StateName from StateId, DistrictName from DistrictId 
