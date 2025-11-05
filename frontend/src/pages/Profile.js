// src/pages/Profile.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><small>Joined: {new Date(user.createdAt || Date.now()).toLocaleString()}</small></p>
    </div>
  );
}
