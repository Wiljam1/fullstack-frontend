import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Search() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const isAllowed = storedUser?.type === 'DOCTOR';
    const [searchTerm, setSearchTerm] = useState('');
    const storedLogin = sessionStorage.getItem('loginSession');
    if (!storedLogin) {
        console.error("User not logged in");
        return;
    }

    const loginSession = JSON.parse(storedLogin);
    const token = loginSession.access_token;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    useEffect(() => {
        if (!isAllowed) {
            console.log("Not authorized, storedId:" + storedUser?.id + " and url id: " + `${id}`);
            navigate('/');
        }
        //searchUsers();
    }, []);

    const searchUsers = async () => {
        try {
            //Search for patients based on name, conditions, username or email.
            //const result = await axios.get(`https://search-wwnr.app.cloud.cbh.kth.se/users/search?pattern=${searchTerm}`);
            console.log("Searching localhost..")
            const result = await axios.get(`https://search-wwnr.app.cloud.cbh.kth.se/users/search?pattern=${searchTerm}`, config);
            console.log(result.data);
            setUsers(result.data);
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
