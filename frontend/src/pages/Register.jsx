import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './register.css';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      const res = await axios.post(
        'https://weather-backend-001h.onrender.com/api/auth/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data?.token && res.data?.user) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        toast.success('✅ Registration successful! You are now logged in.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        toast.success('✅ Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

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
            placeholder='Tell us about yourself!'
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
          <button 
            type="submit" 
            className="btn regBtn submitBtn" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span 
                  className="spinner-border spinner-border-sm" 
                  role="status" 
                  aria-hidden="true"
                ></span>
                &nbsp; Loading...
              </>
            ) : (
              "REGISTER"
            )}
          </button>
        </div>
      </form>

      {/* Global overlay loader */}
      {loading && (
        <div className="overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="overlay-text">Processing your registration...</p>
        </div>
      )}
    </div>
  );
}

export default Register;