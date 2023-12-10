import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AddObservation() {
    let navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [observation, setObservation] = useState({
        performerId: "",
        patientId: "",
        subject: "",
        basedOn: ""
    });

    const { performerId, patientId, subject, basedOn } = observation;

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
        setObservation({ ...observation, [e.target.name]: e.target.value });
    };

    const onSelectUser = (user) => {
        setSelectedPatient(user);
        const jsonData = {
            performerId: storedUser.staffProfile.id,
            patientId: user.patientProfile.id,
            subject: observation.subject,
            basedOn: observation.basedOn
        };
        setObservation(jsonData);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(observation);
        await axios.post("http://localhost:8082/observation", observation);
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Observation</h2>
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
                        <br/>
                        <div className="mb-3">
                            <label htmlFor="Performer" className="form-label">
                                Performer
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="performer"
                                value={isAuthorized ? storedUser.name : ""}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Subject" className="form-label">
                                Subject
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter the subject"
                                name="subject"
                                value={subject}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="BasedOn" className="form-label">
                                Based On
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter based on information"
                                name="basedOn"
                                value={basedOn}
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
