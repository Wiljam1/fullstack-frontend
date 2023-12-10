//import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    let navigate = useNavigate();


    const [user, setUser] = useState({
        name:"",
        username:"",
        email:"",
        type:"DOCTOR",
        password: "",
        observations: [],
        conditions: [],
    })

    const { username, password } = user;
    const [error, setError] = useState(null);

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("test");
        try {
            const response = await axios.post("http://localhost:8081/login", user);
            //console.log('Response to login:', response);
            if (response.status === 200) {
                //sessionStorage.removeItem('user')
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