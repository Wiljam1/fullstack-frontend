import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Search() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const isAllowed = storedUser?.type === 'DOCTOR';
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAllowed) {
            console.log("Not authorized, storedId:" + storedUser?.id + " and url id: " + `${id}`);
            navigate('/');
        }
        //searchUsers();
    }, []);

    const searchUsers = async () => {
        try {
            //ReIndex so new entries can be searched for (slows down performance heavily)
            await axios.get(`http://localhost:8080/index`);

            //Search for patients based on name, conditions, username or email.
            const result = await axios.get(`http://localhost:8080/searchPatients?pattern=${searchTerm}`);
            console.log(result.data);
            setUsers(result.data);
            //maybe reset search
            setSearchTerm('')
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);

    };

    const handleSearchSubmit = (e) => {
        
        e.preventDefault();
        searchUsers();
    };

    return (
        <div className='container'>
            <div className='py-4'>
                <form onSubmit={handleSearchSubmit}>
                    <input
                        className='form-control table shadow border'
                        type='text'
                        placeholder='Search patients...'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>
            <div className='py-4'>
                <table className="table shadow border">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope='col'>Type</th>
                        <th scope="col">Action</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        users.map((user, index) => (
                            <tr key={user.id}>
                                <th scope="row" key={index}>{index+1}</th>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.type}</td>
                                <td>
                                    <Link className='btn btn-primary mx-2' to={`/viewuser/${user.id}`}>View</Link>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
