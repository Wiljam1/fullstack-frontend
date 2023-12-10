import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom';


export default function Home() {

    const  [users, setUsers]=useState([])

    const {id} = useParams()

    useEffect(()=> {
        loadUsers();
        console.log("Information loaded" + id)
    }, []);

    const loadUsers = async () => {
        try {
            const result = await axios.get("http://localhost:8081/users");
            setUsers(result.data);
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };
 
    return (
      <div className='container'>
          <div className='py-4'>
              <div className='mb-3'>
                  <h2>Patient Journal</h2>
                  <p>Welcome to the home page!</p>
              </div>

              {/* Displays all users in database - Remove table later */}
              <table className="table shadow border fixed-bottom">
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
                      {users.map((user, index) => (
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
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  )
}
