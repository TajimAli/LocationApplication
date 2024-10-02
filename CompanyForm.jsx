import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryForm = () => {
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [countries, setCountries] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editCountryId, setEditCountryId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await axios.put(`https://localhost:7025/api/Country/${editCountryId}`, { countryName, countryCode });
            setEditMode(false); 
        } else {
            await axios.post('https://localhost:7025/api/Country', { countryName, countryCode });
        }
        fetchCountries();
        setCountryName('');
        setCountryCode('');
    };

    const fetchCountries = async () => {
        const response = await axios.get('https://localhost:7025/api/Country');
        setCountries(response.data);
    };

    const handleEdit = (country) => {
        setCountryName(country.countryName);
        setCountryCode(country.countryCode);
        setEditMode(true);
        setEditCountryId(country.id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`https://localhost:7025/api/Country/${id}`);
        fetchCountries();
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <div>
            <h2>Manage Countries</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={countryName} onChange={(e) => setCountryName(e.target.value)} placeholder="Country Name" required />
                <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="Country Code" required />
                <button type="submit">{editMode ? 'Update' : 'Add'} Country</button>
            </form>
            <h3>Countries List</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Country Name</th>
                        <th>Country Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {countries.map((country) => (
                        <tr key={country.id}>
                            <td>{country.id}</td>
                            <td>{country.countryName}</td>
                            <td>{country.countryCode}</td>
                            <td>
                                <button onClick={() => handleEdit(country)}>Edit</button>
                                <button onClick={() => handleDelete(country.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CountryForm;
