import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        const staffProfile = user ? user.staffProfile : null;

        setIsAuthenticated(!!user);
        setIsDoctor(!!staffProfile && staffProfile.doctor);

        
    }, [storedUser, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('isDoctor');
        setIsAuthenticated(false);
        setIsDoctor(false);
        navigate('/login');
    };
    
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Patient Journal</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                {isAuthenticated ? (
                        <>
                            <Link className='btn btn-outline-light' to={`/viewuser/${storedUser.id}`}>
                                View your profile
                            </Link>
                            <Link className='btn btn-outline-light' to="/messages">
                                Messages
                            </Link>
                            <Link className='btn btn-outline-light' to="/image-upload">
                                Images
                            </Link>
                            {storedUser.type === 'DOCTOR' ? (
                                <>
                                    <Link className='btn btn-outline-light' to="/patients">
                                        View patients
                                    </Link>
                                    <Link className='btn btn-outline-light' to="/addobservation">
                                        Add Observation
                                    </Link>
                                    <Link className='btn btn-outline-light' to="/addcondition">
                                        Add Condition
                                    </Link>
                                    <Link className='btn btn-outline-light' to="/addencounter">
                                        Add Encounter
                                    </Link>
                                    <Link className='btn btn-outline-light' to="/image-upload">
                                        Images
                                    </Link>
                                    <Link className='btn btn-outline-light' to="/search">
                                        Search
                                    </Link>
                                </>
                            ) : storedUser.type === 'STAFF' ? (
                                <>
                                <Link className='btn btn-outline-light' to="/addobservation">
                                    Add Observation
                                </Link>
                                <Link className='btn btn-outline-light' to="/addencounter">
                                        Add Encounter
                                </Link>
                                <Link className='btn btn-outline-light' to="/image-upload">
                                    Images
                                </Link>
                                </>
                            ) : null}
                            <p className='text-light font-weight-bold mt-2 mb-0'>Logged in as: {storedUser.name}</p>
                            <button className='btn btn-outline-light' onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className='btn btn-outline-light' to="/login">
                                Login
                            </Link>


                            <Link className='btn btn-outline-light' to="/register">
                                Register
                            </Link>
                        </>
                    )}
            </div>
        </nav>
    </div>
  )
}