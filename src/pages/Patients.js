import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Patients() {
  const [users, setUsers] = useState([]);
  const [encounters, setEncounters] = useState([]);
  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const isAllowed = storedUser?.type === 'DOCTOR';
  const [startDate, setStartDate] = useState(new Date());
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
    loadUsers();
    loadEncounters();
  }, []);

  const loadUsers = async () => {
    try {
      // get all patients for logged in doctor
      const result = await axios.get(`https://search-wwnr.app.cloud.cbh.kth.se/searchDoctorPatients?doctorId=${storedUser.staffProfile.id}`, config);
      setUsers(result.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadEncounters = async () => {
    try {
      // get all encounters for a given date
      const date = startDate.toISOString().split('T')[0];
      console.log(`Date sent to database: ${date}`)
      const result = await axios.get(`https://search-wwnr.app.cloud.cbh.kth.se/searchDoctorEncounters?doctorId=${storedUser.staffProfile.id}&date=${date}`, config);
      setEncounters(result.data);
    } catch (error) {
      console.error("Error loading encounters:", error);
    }
  };


  return (
    <div className='container'>
      <div className='py-4'>
        <h2>Your patients</h2>
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
                  <th scope="row" key={index}>{index + 1}</th>
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

      <div className='py-4'>
        <h2>Encounters</h2>
        <div className="mb-3">
          <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
          showIcon
          />
          <p>   </p>
          <button 
          type="button" 
          className="btn btn-primary" 
          onClick={loadEncounters}
        >
          Load Encounters
        </button>
        </div>
        <table className="table shadow border">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Location</th>
              <th scope="col">Patient</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {encounters.map((encounter) => (
              <tr key={encounter.id}>
                <td>{encounter.date}</td>
                <td>{encounter.location}</td>
                <td>{encounter.patientId}</td>
                <td>
                  <Link className='btn btn-primary mx-2' to={`/viewuser/${encounter.patientId}`}>View User</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
