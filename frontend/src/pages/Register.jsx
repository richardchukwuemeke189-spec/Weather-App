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

  // 
  const {setUser} = useAuth();
  // 
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
  data.append('username', formData.username);
  data.append('email', formData.email);
  data.append('location', formData.location);
  data.append('bio', formData.bio);
  data.append('password', formData.password);
  if (formData.photo) {
    data.append('photo', formData.photo);
  }

  try { 
    console.log("API URL:", import.meta.env.VITE_API_URL);
    // const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, data);
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, data);
    toast.success('✅ Registration successful! Redirecting to login...'); 
    setTimeout(() => { window.location.href = '/login';
    }, 1500); 
  } catch (err) { 
    toast.error(err.response?.data?.error || '❌ Registration failed.'); 
  } };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {message && <p className="message">{message}</p>}
      <form className='' onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group formWrap">
          <label htmlFor="">Username</label>
          <input type="text" name="username" required onChange={handleChange} className="inputUsername form-control formInput" placeholder='e.g Orji Miracle' />
        </div>

        <div className="form-group formWrap">
          <label htmlFor="">Email</label>
          <input type="email" name="email" required onChange={handleChange} className="inputEmail form-control formInput" placeholder='@gmail.com' />
        </div>

        <div className='form-group formWrap'>
          <label htmlFor="">Location</label>
          <input type="text" name='location' required  onChange={handleChange} className='inputCity form-control formInput' placeholder='Nigeria, France, Germany ...' />
        </div>

        <div className='form-group formWrap'>
          <label htmlFor="">Bio</label>
          <textarea type="text" name='bio' onChange={handleChange} className='inputBio form-control formInput' placeholder='Tell us about yourself! E.g., "Storm chaser from Oklahoma with a passion for supercells and sunset photography..."' />
        </div>

        <div className="form-group formWrap">
          <label htmlFor="">Profile Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={handleChange} className="inputPhoto form-control formInput" />
        </div>

        <div className="form-group formWrap">
          <label htmlFor="">Password</label>
          <input type="password" name="password" required onChange={handleChange} className="inputPassword form-control formInput" placeholder='********' />
        </div>

        <div style={{justifyContent:'center'}}>
        <button type="submit" className="submitBtn btn regBtn">REGISTER</button>
        </div>
      </form>
    </div>
  );
}

export default Register;