import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StateForm = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [stateName, setStateName] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editStateId, setEditStateId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCountries();
        fetchStates();
    }, []);

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/Country');
            setCountries(response.data);
        } catch (err) {
            console.error('Error fetching countries:', err);
            setError('Failed to fetch countries.');
        }
    };

    const fetchStates = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/State');
            setStates(response.data);
        } catch (err) {
            console.error('Error fetching states:', err);
            setError('Failed to fetch states.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            countryId: selectedCountryId,
            stateName,
            stateCode,
        };

        if (editMode) {
            payload.id = editStateId;
        }

        try {
            if (editMode) {
                console.log('Updating state with payload:', payload);
                await axios.put(`https://localhost:7116/api/State/${editStateId}`, payload);
                console.log('State updated successfully');
            } else {
                console.log('Adding state with payload:', payload);
                await axios.post('https://localhost:7116/api/State', payload);
                console.log('State added successfully');
            }
            resetForm();
            fetchStates();
        } catch (err) {
            console.error('Error during submission:', err.response?.data);
            setError('Error adding/updating state. Please check your input.');
        }
    };

    const handleEdit = (state) => {
        setStateName(state.stateName);
        setStateCode(state.stateCode);
        setSelectedCountryId(state.countryId);
        setEditMode(true);
        setEditStateId(state.id);
        setError('');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7116/api/State/${id}`);
            fetchStates();
            console.log('State deleted successfully');
        } catch (err) {
            console.error('Error deleting state:', err);
            setError('Failed to delete state.');
        }
    };

    const resetForm = () => {
        setStateName('');
        setStateCode('');
        setEditStateId(null);
        setEditMode(false);
        setError('');
        setSelectedCountryId('');
    };

    return (
        <div>
            <div className="container">
                <h2>Manage States</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="">Select Country</label>
                            <select value={selectedCountryId} onChange={(e) => setSelectedCountryId(e.target.value)} required>
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>{country.countryName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="statename">State Name:</label>
                            <input type="text" value={stateName} className="form-control" onChange={(e) => setStateName(e.target.value)} placeholder="State Name" required />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="statecode">State Code</label>
                            <input type="text" value={stateCode} className="form-control" onChange={(e) => setStateCode(e.target.value)} placeholder="State Code" required />
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} State</button>
                </form>
            </div>

            <div>
                <h1>States Table</h1>
                <div className="tableData">
                    <table border="1" className="table" style={{ width: '600px', margin: '20px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>No.</th>
                                {/* <th>ID</th> */}
                                <th>Country</th>
                                <th>State Name</th>
                                <th>State Code</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {states.length > 0 ? (
                                states.map((state, index) => (
                                    <tr key={state.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{state.id}</td> */}
                                        <td>{countries.find(country => country.id === state.countryId)?.countryName}</td>
                                        <td>{state.stateName}</td>
                                        <td>{state.stateCode}</td>
                                        <td>
                                            <button onClick={() => handleEdit(state)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
                                            <button onClick={() => handleDelete(state.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
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

export default StateForm;









//-------Main Code---------------

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const StateForm = () => {
//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [selectedCountryId, setSelectedCountryId] = useState('');
//     const [stateName, setStateName] = useState('');
//     const [stateCode, setStateCode] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editStateId, setEditStateId] = useState(null);

//     useEffect(() => {
//         fetchCountries();
//         fetchStates();
//     }, []);

//     const fetchCountries = async () => {
//         const response = await axios.get('https://localhost:7116/api/Country');
//         setCountries(response.data);
//     };

//     const fetchStates = async () => {
//         const response = await axios.get('https://localhost:7116/api/State');
//         setStates(response.data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (editMode) {
//             await axios.put(`https://localhost:7116/api/State/${editStateId}`, { countryId: selectedCountryId, stateName, stateCode });
//             setEditMode(false);
//         } else {
//             await axios.post('https://localhost:7116/api/State', { countryId: selectedCountryId, stateName, stateCode });
//         }
//         setStateName('');
//         setStateCode('');
//         setSelectedCountryId('');
//         fetchStates();
//     };

//     const handleEdit = (state) => {
//         setStateName(state.stateName);
//         setStateCode(state.stateCode);
//         setSelectedCountryId(state.countryId);
//         setEditMode(true);
//         setEditStateId(state.id);
//     };

//     const handleDelete = async (id) => {
//         await axios.delete(`https://localhost:7116/api/State/${id}`);
//         fetchStates();
//     };

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage States</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-12">
//                             <label htmlFor="">Select Country</label>
//                             <select value={selectedCountryId} onChange={(e) => setSelectedCountryId(e.target.value)} required>
//                                 <option value="">Select Country</option>
//                                 {countries.map((country) => (
//                                     <option key={country.id} value={country.id}>{country.countryName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="statename">State Name:</label>
//                             <input type="text" value={stateName} className="form-control" onChange={(e) => setStateName(e.target.value)} placeholder="State Name" required />
//                         </div>

//                         <div className="form-group col-md-6">
//                             <label htmlFor="statecode">State Code</label>
//                             <input type="text" value={stateCode} className="form-control" onChange={(e) => setStateCode(e.target.value)} placeholder="State Code" required />
//                         </div>
//                     </div>

//                     <button type="submit">{editMode ? 'Update' : 'Add'} State</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>States Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '600px', marginLeft: '27%', alignItems: "center" }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country</th>
//                                 <th>State Name</th>
//                                 <th>State Code</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {states.map((state) => (
//                                 <tr key={state.id}>
//                                     <td>{state.id}</td>
//                                     <td>{countries.find(country => country.id === state.countryId)?.countryName}</td>
//                                     <td>{state.stateName}</td>
//                                     <td>{state.stateCode}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(state)} style={{ width: "60px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(state.id)} style={{ width: "80px", height: "40px" }}>Delete</button>
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

// export default StateForm;