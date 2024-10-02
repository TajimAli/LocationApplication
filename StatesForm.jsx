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

    useEffect(() => {
        fetchCountries();
        fetchStates();
    }, []);

    const fetchCountries = async () => {
        const response = await axios.get('https://localhost:7025/api/Country');
        setCountries(response.data);
    };

    const fetchStates = async () => {
        const response = await axios.get('http://localhost:5000/api/states');
        setStates(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.put(`http://localhost:5000/api/states/${editStateId}`, { countryId: selectedCountryId, stateName, stateCode });
            setEditMode(false);
        } else {
            await axios.post('http://localhost:5000/api/states', { countryId: selectedCountryId, stateName, stateCode });
        }
        setStateName('');
        setStateCode('');
        setSelectedCountryId('');
        fetchStates();
    };

    const handleEdit = (state) => {
        setStateName(state.stateName);
        setStateCode(state.stateCode);
        setSelectedCountryId(state.countryId);
        setEditMode(true);
        setEditStateId(state.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/states/${id}`);
        fetchStates();
    };

    return (
        <div>
            <h2>Manage States</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedCountryId} onChange={(e) => setSelectedCountryId(e.target.value)} required>
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>{country.countryName}</option>
                    ))}
                </select>
                <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State Name" required />
                <input type="text" value={stateCode} onChange={(e) => setStateCode(e.target.value)} placeholder="State Code" required />
                <button type="submit">{editMode ? 'Update' : 'Add'} State</button>
            </form>
            <h3>States List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>State Name</th>
                        <th>State Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {states.map((state) => (
                        <tr key={state.id}>
                            <td>{state.id}</td>
                            <td>{countries.find(country => country.id === state.countryId)?.countryName}</td>
                            <td>{state.stateName}</td>
                            <td>{state.stateCode}</td>
                            <td>
                                <button onClick={() => handleEdit(state)}>Edit</button>
                                <button onClick={() => handleDelete(state.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StateForm;
