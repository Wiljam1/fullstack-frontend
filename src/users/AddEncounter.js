import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddObservation() {
    let navigate = useNavigate();
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const [users, setUsers] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [startDate, setStartDate] = useState(new Date());

    const [encounter, setEncounter] = useState({
        practitionerId: "",
        patientId: "",
        date: "",
        location: ""
    });

    const { practitionerId, patientId, date, location } = encounter;

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

    useEffect(() => {
        const jsonData = {
          practitionerId: storedUser.staffProfile.id,
          patientId: selectedPatient?.patientProfile.id || "",
          date: startDate.toISOString().split('T')[0],
          location: encounter.location,
        };
        setEncounter(jsonData);
        console.log("Encounter: ", encounter);
      }, [startDate, selectedPatient, encounter.location, storedUser.staffProfile.id]);

    const onInputChange = (e) => {
        setEncounter({ ...encounter, [e.target.name]: e.target.value });
    };

    const onSelectUser = (user) => {
        const jsonData = {
            practitionerId: storedUser.staffProfile.id,
            patientId: user.patientProfile.id,
            date: startDate.toISOString().split('T')[0],
            location: encounter.location,
        };
        setSelectedPatient(user);
        setEncounter(jsonData);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(encounter);
        const jsonData = {
            practitionerId: storedUser.staffProfile.id,
            patientId: selectedPatient.patientProfile.id,
            date: startDate.toISOString().split('T')[0],
            location: encounter.location,
        };
        setEncounter(jsonData);
        await axios.post("http://localhost:8082/encounter", encounter);
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Encounter</h2>
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
                            <label htmlFor="Practitioner" className="form-label">
                                Practitioner
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="practitioner"
                                value={isAuthorized ? storedUser.name : ""}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Date" className="form-label">
                                Date
                            </label>
                            <br/>
                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Location" className="form-label">
                                Location
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter location"
                                name="location"
                                value={location}
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
