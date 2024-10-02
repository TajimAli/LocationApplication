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

    useEffect(() => {
        fetchCountries();
        fetchCities();
    }, []);

    const fetchCountries = async () => {
        const response = await axios.get('http://localhost:5000/api/countries');
        setCountries(response.data);
    };

    const fetchStates = async (countryId) => {
        const response = await axios.get(`http://localhost:5000/api/states?countryId=${countryId}`);
        setStates(response.data);
    };

    const fetchDistricts = async (stateId) => {
        const response = await axios.get(`http://localhost:5000/api/districts?stateId=${stateId}`);
        setDistricts(response.data);
    };

    const fetchCities = async () => {
        const response = await axios.get('http://localhost:5000/api/cities');
        setCities(response.data);
    };

    const handleCountryChange = (e) => {
        setSelectedCountryId(e.target.value);
        fetchStates(e.target.value);
    };

    const handleStateChange = (e) => {
        setSelectedStateId(e.target.value);
        fetchDistricts(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.put(`http://localhost:5000/api/cities/${editCityId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityName });
            setEditMode(false);
        } else {
            await axios.post('http://localhost:5000/api/cities', { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityName });
        }
        setCityName('');
        setSelectedDistrictId('');
        setSelectedStateId('');
        setSelectedCountryId('');
        fetchCities();
    };

    const handleEdit = (city) => {
        setCityName(city.cityName);
        setSelectedDistrictId(city.districtId);
        setSelectedStateId(city.stateId);
        setSelectedCountryId(city.countryId);
        setEditMode(true);
        setEditCityId(city.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/cities/${id}`);
        fetchCities();
    };

    return (
        <div>
            <h2>Manage Cities</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedCountryId} onChange={handleCountryChange} required>
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>{country.countryName}</option>
                    ))}
                </select>
                <select value={selectedStateId} onChange={handleStateChange} required>
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.stateName}</option>
                    ))}
                </select>
                <select value={selectedDistrictId} onChange={(e) => setSelectedDistrictId(e.target.value)} required>
                    <option value="">Select District</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>{district.districtName}</option>
                    ))}
                </select>
                <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="City Name" required />
                <button type="submit">{editMode ? 'Update' : 'Add'} City</button>
            </form>
            <h3>Cities List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>District</th>
                        <th>City Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map((city) => (
                        <tr key={city.id}>
                            <td>{city.id}</td>
                            <td>{countries.find(country => country.id === city.countryId)?.countryName}</td>
                            <td>{states.find(state => state.id === city.stateId)?.stateName}</td>
                            <td>{districts.find(district => district.id === city.districtId)?.districtName}</td>
                            <td>{city.cityName}</td>
                            <td>
                                <button onClick={() => handleEdit(city)}>Edit</button>
                                <button onClick={() => handleDelete(city.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CityForm;
