//import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    let navigate = useNavigate();


    const [user, setUser] = useState({
        username:"",
        password: "",
    })

    const { username, password } = user;
    const [error, setError] = useState(null);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const getToken = async (username, password) => {
        const tokenUrl = 'https://keycloak.app.cloud.cbh.kth.se/realms/patient-keycloak/protocol/openid-connect/token';
        const client_id = 'spring-auth';
        const grant_type = 'password';
        const client_secret = 'Cy5NXaZEkQaXm7TjI6Uq1CBTmNz6ainJ'; 
    
        const params = new URLSearchParams();
        params.append('client_id', client_id);
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', grant_type);
        params.append('client_secret', client_secret);
    
        try {
            const response = await axios.post(tokenUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log("got Token;")
            console.log(response)
            // Saving loginSession so refreshtoken etc can be used throughout the whole frontend
            sessionStorage.setItem('loginSession', JSON.stringify(response.data));
            return response.data.access_token;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw error;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("test");
        try {
            console.log(user)
              const token = await getToken(user.username, user.password);
              const response = await axios.post("https://users-wwnr.app.cloud.cbh.kth.se/login", user, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });
              // WORKS LOCALLY;
              /*const response = await axios.post("http://localhost:8081/login", user, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });*/
            console.log(response)
            //console.log('Response to login:', response); s
            if (response.status === 200) {
                // TODO: Rework in the whole frontend, use the token for site access etc?
                sessionStorage.setItem('user', JSON.stringify(response.data));
                sessionStorage.setItem('userId', response.data.id);
                const isDoctor = response.data.doctorProfile !== null;
                sessionStorage.setItem('isDoctor', JSON.stringify(isDoctor));

                setUser({
                    username: "",
                    password: ""
                });

                navigate('/');
            } else {
                setError("Invalid username or password");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("Unexpected error occurred");
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Login</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Username' className='form-label'>
                                Username
                            </label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter your username'
                                name='username'
                                value={username}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='Password' className='form-label'>
                                Password
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Enter your password'
                                name='password'
                                value={password}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className='btn btn-outline-primary'>
                            Log In
                        </button>
                        <Link className='btn btn-outline-danger mx-2' to='/'>
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}