import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

export default function ViewUser() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    type: "",
    patientProfile: null,
    doctorProfile: null,
  });

  const [observationsLoaded, setObservationsLoaded] = useState(false);
  const [observations, setObservations] = useState([]);
  const [conditionsLoaded, setConditionsLoaded] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [encountersLoaded, setEncountersLoaded] = useState(false);
  const [encounters, setEncounters] = useState([]);

  const navigate = useNavigate();
  const storedUser = JSON.parse(sessionStorage.getItem('user'));
  const { id } = useParams();

  const isAuthorized = storedUser?.id == id || storedUser?.type === 'DOCTOR';

  useEffect(() => {
    if (!isAuthorized) {
      console.log("Not authorized, storedId:" + storedUser?.id + " and url id: " + `${id}`);
      navigate('/');
      return;
    }

    loadUser();
  }, [id, navigate, storedUser]);

  const fetchData = async (url, onSuccess, onError) => {
    try {
      const result = await axios.get(url);
      onSuccess(result.data);
    } catch (error) {
      console.error(`Error: ${onError}`, error);
    }
  };
  
  const loadObservations = async (profileId, userType) => {
    const endpoint = userType === 'patient' ? 'patient' : 'staff';
    const url = `http://localhost:8082/observation/${endpoint}/${profileId}`;
    fetchData(url, setObservations, 'loading observations');
  };
  
  const loadConditions = async (profileId, userType) => {
    const endpoint = userType === 'patient' ? 'patient' : 'staff';
    const url = `http://localhost:8082/condition/${endpoint}/${profileId}`;
    fetchData(url, setConditions, 'loading conditions');
  };
  
  const loadEncounters = async (profileId, userType) => {
    const endpoint = userType === 'patient' ? 'patient' : 'staff';
    const url = `http://localhost:8082/encounter/${endpoint}/${profileId}`;
    fetchData(url, setEncounters, 'loading encounters');
  };
  
  const loadUser = async () => {
  try {
    const userResult = await axios.get(`http://localhost:8081/user/${id}`);
    const user = userResult.data;

    //console.log("User Profile:", user);
    setUser(user);

    if (user.patientProfile) {
      if (!observationsLoaded) {
        await loadObservations(user.patientProfile.id, 'patient');
        setObservationsLoaded(true);
      }

      if (!conditionsLoaded) {
        await loadConditions(user.patientProfile.id, 'patient');
        setConditionsLoaded(true);
      }

      if (!encountersLoaded) {
        await loadEncounters(user.patientProfile.id, 'patient');
        setEncountersLoaded(true);
      }
    } else if (user.staffProfile) {
      if (!encountersLoaded) {
        await loadEncounters(user.staffProfile.id, 'staff');
        setEncountersLoaded(true);
      }
    }
  } catch (error) {
    console.error("Error loading user:", error);
  }
};

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>User Details</h2>

          <div className='card'>
            <div className='card-header'>
              Details of user id : {user.id}
              <ul className='list-group list-group-flush'>
                <li className='list-group-item'>
                  <b>Name: </b>
                  {user.name}
                </li>
                <li className='list-group-item'>
                  <b>Username: </b>
                  {user.username}
                </li>
                <li className='list-group-item'>
                  <b>Email: </b>
                  {user.email}
                </li>
                <li className='list-group-item'>
                  <b>Type: </b>
                  {user.type}
                </li>

                {/* Display patient-specific information */}
                {user.patientProfile && (
                  <>
                    <li className='list-group-item'>
                      <b>Birthdate: </b>
                      {user.patientProfile.birthdate}
                    </li>
                    <li className='list-group-item'>
                      <b>Observations: </b>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Subject</th>
                            <th scope="col">Based On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {observations.map((observation) => (
                            <tr key={observation.id}>
                              <td>{observation.subject}</td>
                              <td>{observation.basedOn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </li>
                    <li className='list-group-item'>
                      <b>Conditions: </b>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conditions.map((condition) => (
                            <tr key={condition.id}>
                              <td>{condition.name}</td>
                              <td>{condition.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </li>
                    <li className='list-group-item'>
                      <b>Encounters: </b>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Location</th>
                            <th scope="col">Practitioner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {encounters.map((encounter) => (
                            <tr key={encounter.id}>
                              <td>{encounter.date}</td>
                              <td>{encounter.location}</td>
                              <td>{encounter.practitionerId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </li>
                  </>
                )}

                {/* Display doctor-specific information */}
                {user.staffProfile && (
                  <>
                    <li className='list-group-item'>
                      <b>Specialty: </b>
                      {user.staffProfile.specialty}
                    </li>
                    <li className='list-group-item'>
                      <b>Encounters: </b>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Location</th>
                            <th scope="col">Patient</th>
                          </tr>
                        </thead>
                        <tbody>
                          {encounters.map((encounter) => (
                            <tr key={encounter.id}>
                              <td>{encounter.date}</td>
                              <td>{encounter.location}</td>
                              <td>{encounter.patientId}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <Link className='btn btn-primary my-2' to={'/'}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
