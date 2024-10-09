import React from 'react';
import axios from 'axios';

const Table = ({ data, fetchData }) => {
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/countries/${id}`);
        fetchData();
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Country Name</th>
                    <th>Country Code</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.countryName}</td>
                        <td>{item.countryCode}</td>
                        <td>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                            {/* Implement edit functionality */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;


//----------Join for Sql Tables----------
// SELECT 
//     Id AS CountryId, 
//     CountryName, 
//     CountryCode 
// FROM 
//     Countries;

// SELECT 
//     s.Id AS StateId, 
//     c.CountryName, 
//     s.StateName, 
//     s.StateCode 
// FROM 
//     States s
// JOIN 
//     Countries c ON s.CountryId = c.Id;



// 	SELECT 
//     d.Id AS DistrictId, 
//     c.CountryName, 
//     s.StateName, 
//     d.DistrictName 
// FROM 
//     Districts d
// JOIN 
//     States s ON d.StateId = s.Id
// JOIN 
//     Countries c ON d.CountryId = c.Id;



// 	SELECT 
//     ci.Id AS CityId, 
//     c.CountryName, 
//     s.StateName, 
//     d.DistrictName, 
//     ci.CityName 
// FROM 
//     Cities ci
// JOIN 
//     Districts d ON ci.DistrictId = d.Id
// JOIN 
//     States s ON ci.StateId = s.Id
// JOIN 
//     Countries c ON ci.CountryId = c.Id;



// 	SELECT 
//     fa.Id AS FullAddressId, 
//     c.CountryName, 
//     s.StateName, 
//     d.DistrictName, 
//     ci.CityName 
// FROM 
//     FullAddresses fa
// JOIN 
//     Cities ci ON fa.CityId = ci.Id
// JOIN 
//     Districts d ON ci.DistrictId = d.Id
// JOIN 
//     States s ON ci.StateId = s.Id
// JOIN 
//     Countries c ON ci.CountryId = c.Id;
