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

    useEffect(() => {
        fetchCountries();
        fetchDistricts();
    }, []);

    const fetchCountries = async () => {
        const response = await axios.get('http://localhost:5000/api/countries');
        setCountries(response.data);
    };

    const fetchStates = async (countryId) => {
        const response = await axios.get(`http://localhost:5000/api/states?countryId=${countryId}`);
        setStates(response.data);
    };

    const fetchDistricts = async () => {
        const response = await axios.get('http://localhost:5000/api/districts');
        setDistricts(response.data);
    };

    const handleCountryChange = (e) => {
        setSelectedCountryId(e.target.value);
        fetchStates(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.put(`http://localhost:5000/api/districts/${editDistrictId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtName });
            setEditMode(false);
        } else {
            await axios.post('http://localhost:5000/api/districts', { countryId: selectedCountryId, stateId: selectedStateId, districtName });
        }
        setDistrictName('');
        setSelectedStateId('');
        setSelectedCountryId('');
        fetchDistricts();
    };

    const handleEdit = (district) => {
        setDistrictName(district.districtName);
        setSelectedStateId(district.stateId);
        setSelectedCountryId(district.countryId);
        setEditMode(true);
        setEditDistrictId(district.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/districts/${id}`);
        fetchDistricts();
    };

    return (
        <div>
            <h2>Manage Districts</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedCountryId} onChange={handleCountryChange} required>
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>{country.countryName}</option>
                    ))}
                </select>
                <select value={selectedStateId} onChange={(e) => setSelectedStateId(e.target.value)} required>
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.stateName}</option>
                    ))}
                </select>
                <input type="text" value={districtName} onChange={(e) => setDistrictName(e.target.value)} placeholder="District Name" required />
                <button type="submit">{editMode ? 'Update' : 'Add'} District</button>
            </form>
            <h3>Districts List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>District Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {districts.map((district) => (
                        <tr key={district.id}>
                            <td>{district.id}</td>
                            <td>{countries.find(country => country.id === district.countryId)?.countryName}</td>
                            <td>{states.find(state => state.id === district.stateId)?.stateName}</td>
                            <td>{district.districtName}</td>
                            <td>
                                <button onClick={() => handleEdit(district)}>Edit</button>
                                <button onClick={() => handleDelete(district.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DistrictForm;
