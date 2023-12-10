import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
export default function AddUser() {
  let navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    type: "PATIENT",
    profile: {},
  });
  const { name, username, email, type, password, custom } = user;
  const showIsDoctorCheckbox = type === 'STAFF';
  const showDatePicker = type === 'PATIENT';
  const [startDate, setStartDate] = useState(new Date());
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const [isDoctor, setIsDoctor] = useState(false);

  const onCheckboxChange = () => {
    setIsDoctor(!isDoctor);
  }

  const getCustomFieldInfo = (type) => {
    if (type === 'STAFF') {
      return {
        label: 'Enter your specialty',
        placeholder: 'Specialty',
      };
    } else if (type === 'PATIENT') {
      return {
        label: 'Enter your birthdate',
        placeholder: 'Birthdate',
      };
    } else {
      return {
        label: 'Custom Field',
        placeholder: 'Enter custom data',
      };
    }
  };
  const customFieldInfo = getCustomFieldInfo(type);
  const onSubmit = async (e) => {
    e.preventDefault();
  
    let userData = {
      username,
      name,
      email,
      password,
      type,
    };
  
    if (type === 'STAFF') {
      if (isDoctor) {
        userData.type = 'DOCTOR';
      }
      userData.staffProfile = {
        specialty: custom,
        doctor: isDoctor, 
      };
    } else if (type === 'PATIENT') {
      userData.patientProfile = {
        birthdate: startDate.toISOString().split('T')[0],
      };
    }
  
    console.log('Form Data:', userData);

    await axios.post("http://localhost:8081/user", userData);
    navigate("/");
  };
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
          <h2 className='text-center m-4'>Register User</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className='mb-3'>
              <label htmlFor='Name' className='form-label'>
                Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                name="name"
                value={name}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='Username' className='form-label'>
                Username
              </label>
              <input
                type="text"
                className='form-control'
                placeholder='Enter your username'
                name="username"
                value={username}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='Email' className='form-label'>
                E-mail
              </label>
              <input
                type="text"
                className='form-control'
                placeholder='Enter your e-mail address'
                name="email"
                value={email}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='Password' className='form-label'>
                Password
              </label>
              <input
                type="password"
                className='form-control'
                placeholder='Enter your password'
                name="password"
                value={password}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Type" className="form-label">
                User Type
              </label>
              <select
                className="form-select"
                name="type"
                value={type}
                onChange={(e) => onInputChange(e)}
              >
                <option value="PATIENT">PATIENT</option>
                <option value="STAFF">STAFF</option>
              </select>
            </div>
              <div className='mb-3'>
                <label htmlFor='custom' className='form-label'>
                  {customFieldInfo.label}
                </label>
                <br/>
                {showDatePicker ? (
                  
                  <DatePicker
                    dateFormat="yyyy-MM-dd"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder={customFieldInfo.placeholder}
                    name="custom"
                    value={custom}
                    onChange={(e) => onInputChange(e)}
                  />
                )}
              </div>
            {showIsDoctorCheckbox && (
            <div className='mb-3'>
              <label htmlFor='isDoctor' className='form-check-label'>
                Is Doctor?
              </label>
              
                <div className='form-check d-flex justify-content-center'>
                  <input
                    type="checkbox"
                    className='form-check-input'
                    name="isDoctor"
                    checked={isDoctor}
                    onChange={onCheckboxChange}
                  />
                </div>
            </div>
            )}
            <button type='submit' className='btn btn-outline-primary'>
              Submit
            </button>
            <Link className='btn btn-outline-danger mx-2' to="/">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}