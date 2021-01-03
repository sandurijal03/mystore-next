import React, { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { baseUrl } from '../helpers/baseUrl';

const UserRoles = () => {
  const [users, setUsers] = useState([]);

  const { token } = parseCookies();
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      headers: {
        Authorization: token,
      },
    });
    const response = await res.json();
    setUsers(response);
  };

  const handleRole = async (_id, role) => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        _id,
        role,
      }),
    });
    const response = await res.json();
    const updatedUsers = users.map((user) => {
      if (user.role !== response.role && user.email === response.email) {
        return response;
      } else {
        return user;
      }
    });
    setUsers(updatedUsers);
  };

  return (
    <>
      <h1>User Roles</h1>;
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            return (
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td onClick={() => handleRole(user._id, user.role)}>
                  {user.role}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default UserRoles;
