import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryForm = () => {
    const [countryName, setCountryName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [countries, setCountries] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editCountryId, setEditCountryId] = useState(null);
    const [error, setError] = useState('');

    const fetchCountries = async () => {
        try {
            const response = await axios.get('https://localhost:7116/api/Country');
            setCountries(response.data);
        } catch (err) {
            console.error('Error fetching countries:', err);
            setError('Failed to fetch countries.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            id: editCountryId,
            countryName,
            countryCode
        };

        try {
            if (editMode) {
                console.log('Updating country with payload:', payload);
                const response = await axios.put(`https://localhost:7116/api/Country/${editCountryId}`, payload);
                console.log('Country updated successfully:', response.data);
            } else {
                console.log('Adding country with payload:', payload);
                const response = await axios.post('https://localhost:7116/api/Country', { countryName, countryCode });
                console.log('Country added:', response.data);
            }
            resetForm();
            fetchCountries();
        } catch (err) {
            console.error('Error during submission:', err.response?.data);
            setError('Error adding/updating country. Please check your input.');
        }
    };

    const handleEdit = (country) => {
        setCountryName(country.countryName);
        setCountryCode(country.countryCode);
        setEditMode(true);
        setEditCountryId(country.id);
        setError('');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7116/api/Country/${id}`);
            fetchCountries();
            console.log('Country deleted successfully');
        } catch (err) {
            console.error('Error deleting country:', err);
            setError('Failed to delete country.');
        }
    };

    const resetForm = () => {
        setCountryName('');
        setCountryCode('');
        setEditCountryId(null);
        setEditMode(false);
        setError('');
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <div>
            <div className="container">
                <h1>Add Your Country</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="countryName">Country Name</label>
                            <input type="text" id="countryName" value={countryName} className="form-control" onChange={(e) => setCountryName(e.target.value)} placeholder="Country Name" required />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="countryCode">Country Code</label>
                            <input type="text" id="countryCode" value={countryCode} className="form-control" onChange={(e) => setCountryCode(e.target.value)} placeholder="Country Code" required />
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Add'} Country</button>
                </form>
            </div>

            <div>
                <h1>Countries Table</h1>
                <div className="tableData">
                    <table border="1" className="table" style={{ width: '600px', margin: '20px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>No.</th>
                                {/* <th>ID</th> */}
                                <th>Country Name</th>
                                <th>Country Code</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {countries.length > 0 ? (
                                countries.map((country, index) => (
                                    <tr key={country.id}>
                                        <td>{index + 1}</td>
                                        {/* <td>{country.id}</td> */}
                                        <td>{country.countryName}</td>
                                        <td>{country.countryCode}</td>
                                        <td>
                                            <button onClick={() => handleEdit(country)} className="btn btn-warning" style={{ marginRight: '5px', width: "70px", height: "40px" }}>Edit</button>
                                            <button onClick={() => handleDelete(country.id)} className="btn btn-danger" style={{ width: "80px", height: "40px" }}>Delete</button>
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

export default CountryForm;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CountryForm = () => {
//     const [countryName, setCountryName] = useState('');
//     const [countryCode, setCountryCode] = useState('');
//     const [countries, setCountries] = useState([]);
//     const [editMode, setEditMode] = useState(false);
//     const [editCountryId, setEditCountryId] = useState(null);
//     const [error, setError] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = { countryName, countryCode };

//         try {
//             if (editMode) {
//                 await axios.put(`https://localhost:7116/api/Country/${editCountryId}`, payload);
//                 setEditMode(false);
//             } else {
//                 await axios.post('https://localhost:7116/api/Country/', payload);
//             }
//             fetchCountries();
//             setCountryName('');
//             setCountryCode('');
//             setError(null); // Clear any previous errors
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
//             setError(errorMessage);
//         }
//     };

//     const fetchCountries = async () => {
//         try {
//             const response = await axios.get('https://localhost:7116/api/Country');
//             setCountries(response.data);
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to fetch countries.';
//             setError(errorMessage);
//         }
//     };

//     const handleEdit = (country) => {
//         setCountryName(country.countryName);
//         setCountryCode(country.countryCode);
//         setEditMode(true);
//         setEditCountryId(country.id);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`https://localhost:7116/api/Country/${id}`);
//             fetchCountries();
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to delete country.';
//             setError(errorMessage);
//         }
//     };

//     useEffect(() => {
//         fetchCountries();
//     }, []);

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Countries</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="countryName">Country Name</label>
//                             <input
//                                 type="text"
//                                 id="countryName"
//                                 value={countryName}
//                                 className="form-control"
//                                 onChange={(e) => setCountryName(e.target.value)}
//                                 placeholder="Country Name"
//                                 required
//                             />
//                         </div>

//                         <div className="form-group col-md-6">
//                             <label htmlFor="countryCode">Country Code</label>
//                             <input
//                                 type="text"
//                                 id="countryCode"
//                                 value={countryCode}
//                                 className="form-control"
//                                 onChange={(e) => setCountryCode(e.target.value)}
//                                 placeholder="Country Code"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <button type="submit" className="btn btn-primary">
//                         {editMode ? 'Update' : 'Add'} Country
//                     </button>
//                     {error && <div className="alert alert-danger mt-2">{String(error)}</div>}
//                 </form>
//             </div>

//             <div>
//                 <h1>Countries Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '500px', margin: '20px auto' }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country Name</th>
//                                 <th>Country Code</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {countries.map((country) => (
//                                 <tr key={country.id}>
//                                     <td>{country.id}</td>
//                                     <td>{country.countryName}</td>
//                                     <td>{country.countryCode}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(country)} className="btn btn-warning" style={{ marginRight: '5px' }}>Edit</button>
//                                         <button onClick={() => handleDelete(country.id)} className="btn btn-danger">Delete </button>
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

// export default CountryForm;








//------------main Code-------------


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CountryForm = () => {
//     const [countryName, setCountryName] = useState('');
//     const [countryCode, setCountryCode] = useState('');
//     const [countries, setCountries] = useState([]);
//     const [editMode, setEditMode] = useState(false);
//     const [editCountryId, setEditCountryId] = useState(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (editMode) {
//             await axios.put(`https://localhost:7116/api/Country/${editCountryId}`, { countryName, countryCode });
//             setEditMode(false);
//         } else {
//             await axios.post('https://localhost:7116/api/Country/', { countryName, countryCode });
//         }
//         fetchCountries();
//         setCountryName('');
//         setCountryCode('');
//     };

//     const fetchCountries = async () => {
//         const response = await axios.get('https://localhost:7116/api/Country');
//         setCountries(response.data);
//     };

//     const handleEdit = (country) => {
//         setCountryName(country.countryName);
//         setCountryCode(country.countryCode);
//         setEditMode(true);
//         setEditCountryId(country.id);
//     };

//     const handleDelete = async (id) => {
//         await axios.delete(`https://localhost:7116/api/Country/${id}`);
//         fetchCountries();
//     };

//     useEffect(() => {
//         fetchCountries();
//     }, []);

//     return (
//         <div>
//             <div className="container">
//                 <h2>Manage Countries</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-row">
//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Country Name</label>
//                             <input type="text" value={countryName} className="form-control" onChange={(e) => setCountryName(e.target.value)} placeholder="Country Name" required />
//                         </div>

//                         <div className="form-group col-md-6">
//                             <label htmlFor="">Country Code</label>
//                             <input type="text" value={countryCode} className="form-control" onChange={(e) => setCountryCode(e.target.value)} placeholder="Country Code" required />
//                         </div>
//                     </div>

//                     <button type="submit">{editMode ? 'Update' : 'Add'} Country</button>
//                 </form>
//             </div>

//             <div>
//                 <h1>Countries Table</h1>
//                 <div className="tableData">
//                     <table border="1" className="table" style={{ width: '500px', marginLeft: '31%', alignItems: "center" }}>
//                         <thead className="thead-dark">
//                             <tr>
//                                 <th>ID</th>
//                                 <th>Country Name</th>
//                                 <th>Country Code</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {countries.map((country) => (
//                                 <tr key={country.id}>
//                                     <td>{country.id}</td>
//                                     <td>{country.countryName}</td>
//                                     <td>{country.countryCode}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(country)} style={{ width: "60px", height: "40px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(country.id)} style={{ width: "80px", height: "40px" }}>Delete</button>
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

// export default CountryForm;