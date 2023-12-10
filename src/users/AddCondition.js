import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddObservation() {
    let navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [condition, setCondition] = useState({
        doctorId: "",
        patientId: "",
        name: "",
        description: ""
    });

    const { doctorId, patientId, name, description } = condition;

    const isAuthorized = storedUser !== null && storedUser.staffProfile;

    useEffect(() => {
        if (!isAuthorized) {
            navigate('/');
            return;
        }

        const loadUsers = async () => {
            const result = await axios.get('http://localhost:8081/patients');
            setUsers(result.data);
        };
        loadUsers();
    }, [isAuthorized]);

    const onInputChange = (e) => {
        setCondition({ ...condition, [e.target.name]: e.target.value });
    };

    const onSelectUser = (user) => {
        setSelectedPatient(user);
        const jsonData = {
            doctorId: storedUser.staffProfile.id,
            patientId: user.patientProfile.id,
            name: condition.name,
            description: condition.description
        };
        setCondition(jsonData);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(condition);
        await axios.post("http://localhost:8082/condition", condition);
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Condition</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        {isAuthorized && (
                            <div>
                                <label htmlFor="patient">Select Patient</label>
                                <br/>
                                <select
                                    id="patient"
                                    onChange={(e) => onSelectUser(JSON.parse(e.target.value))}
                                >
                                    <option value="">-patient-</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={JSON.stringify(user)}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <br />
                        <div className="mb-3">
                            <label htmlFor="Doctor" className="form-label">
                                Doctor
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="doctor"
                                value={isAuthorized ? storedUser.name : ""}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Subject" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter the name"
                                name="name"
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="BasedOn" className="form-label">
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter a description"
                                name="description"
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary">
                            Submit
                        </button>
                        <Link className="btn btn-outline-danger mx-2" to="/">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
