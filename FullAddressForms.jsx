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
    const [fullAddress, setFullAddress] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);

    useEffect(() => {
        fetchCountries();
        fetchAddresses();
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

    const fetchCities = async (districtId) => {
        const response = await axios.get(`http://localhost:5000/api/cities?districtId=${districtId}`);
        setCities(response.data);
    };

    const fetchAddresses = async () => {
        const response = await axios.get('http://localhost:5000/api/addresses');
        setFullAddress(response.data);
    };

    const handleCountryChange = (e) => {
        setSelectedCountryId(e.target.value);
        fetchStates(e.target.value);
    };

    const handleStateChange = (e) => {
        setSelectedStateId(e.target.value);
        fetchDistricts(e.target.value);
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrictId(e.target.value);
        fetchCities(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.put(`http://localhost:5000/api/addresses/${editAddressId}`, { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityId: selectedCityId, fullAddress });
            setEditMode(false);
        } else {
            await axios.post('http://localhost:5000/api/addresses', { countryId: selectedCountryId, stateId: selectedStateId, districtId: selectedDistrictId, cityId: selectedCityId, fullAddress });
        }
        setFullAddress('');
        setSelectedCityId('');
        setSelectedDistrictId('');
        setSelectedStateId('');
        setSelectedCountryId('');
        fetchAddresses();
    };

    const handleEdit = (address) => {
        setFullAddress(address.fullAddress);
        setSelectedCityId(address.cityId);
        setSelectedDistrictId(address.districtId);
        setSelectedStateId(address.stateId);
        setSelectedCountryId(address.countryId);
        setEditMode(true);
        setEditAddressId(address.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/addresses/${id}`);
        fetchAddresses();
    };

    return (
        <div>
            <h2>Manage Full Addresses</h2>
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
                <select value={selectedDistrictId} onChange={handleDistrictChange} required>
                    <option value="">Select District</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>{district.districtName}</option>
                    ))}
                </select>
                <select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} required>
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.cityName}</option>
                    ))}
                </select>
                <input type="text" value={fullAddress} onChange={(e) => setFullAddress(e.target.value)} placeholder="Full Address" required />
                <button type="submit">{editMode ? 'Update' : 'Add'} Full Address</button>
            </form>
            <h3>Full Addresses List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>District</th>
                        <th>City</th>
                        <th>Full Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fullAddress.map((address) => (
                        <tr key={address.id}>
                            <td>{address.id}</td>
                            <td>{countries.find(country => country.id === address.countryId)?.countryName}</td>
                            <td>{states.find(state => state.id === address.stateId)?.stateName}</td>
                            <td>{districts.find(district => district.id === address.districtId)?.districtName}</td>
                            <td>{cities.find(city => city.id === address.cityId)?.cityName}</td>
                            <td>{address.fullAddress}</td>
                            <td>
                                <button onClick={() => handleEdit(address)}>Edit</button>
                                <button onClick={() => handleDelete(address.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FullAddressForm;
