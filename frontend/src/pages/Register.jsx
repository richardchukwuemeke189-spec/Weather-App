import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    password: '',
    bio: '',
    photo: null
  });

  const { setUser } = useAuth();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // If backend returns user + token, auto-login
      if (res.data?.token && res.data?.user) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('✅ Registration successful! You are now logged in.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        // Otherwise, redirect to login
        toast.success('✅ Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group formWrap">
          <label>Username</label>
          <input
            type="text"
            name="username"
            required
            onChange={handleChange}
            className="form-control formInput"
            placeholder="e.g Orji Miracle"
          />
        </div>

        <div className="form-group formWrap">
          <label>Email</label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
            className="form-control formInput"
            placeholder="@gmail.com"
          />
        </div>

        <div className="form-group formWrap">
          <label>Location</label>
          <input
            type="text"
            name="location"
            required
            onChange={handleChange}
            className="form-control formInput"
            placeholder="Nigeria, France, Germany ..."
          />
        </div>

        <div className="form-group formWrap">
          <label>Bio</label>
          <textarea
            name="bio"
            onChange={handleChange}
            className="form-control formInput"
            placeholder='Tell us about yourself! E.g., "Storm chaser from Oklahoma with a passion for supercells and sunset photography..."'
          />
        </div>

        <div className="form-group formWrap">
          <label>Profile Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="form-control formInput"
          />
        </div>

        <div className="form-group formWrap">
          <label>Password</label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="form-control formInput"
            placeholder="********"
          />
        </div>

        <div style={{ justifyContent: 'center' }}>
          <button type="submit" className="btn regBtn submitBtn">
            REGISTER
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;