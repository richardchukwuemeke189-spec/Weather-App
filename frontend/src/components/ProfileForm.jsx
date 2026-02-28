import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../style/profileForm.css'
import '../style/form.css'
import { useAuth } from '../context/AuthContext';

function ProfileForm() {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        location: '',
        bio: '',
        photo: null
    });
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current user info
    const token = localStorage.getItem('token');
    // fetch(`${import.meta.env.VITE_USER_URL}/me`, {
    fetch(`https://weather-backend-001h.onrender.com/api/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          username: data.username || '',
          email: data.email || '',
          location: data.location || '',
          bio: data.bio || '',
        }));
        if (data.photo) {
          // setPreview(`${import.meta.env.VITE_UPLOADS_URL}/${data.photo}`);
          setPreview(`https://weather-backend-001h.onrender.com/uploads/${data.photo}`);
        }
      })
      .catch(err => {
        console.error('Failed to load profile:', err);
        setMessage('Failed to load profile info.');
      });
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('location', formData.location);
    form.append('bio', formData.bio);
    if (formData.photo) form.append('photo', formData.photo);

    try {
      // const res = await fetch(`${import.meta.env.VITE_USER_URL}/api/user/update`, {
      const res = await fetch(`https://weather-backend-001h.onrender.com/api/user/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser(); // 🔁 Update global user state
        toast.success('Profile updates successfully!');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setMessage(data.error || 'Update failed.');
      }
    } catch (err) {
        console.error('Update error:', err);
        toast.error('Something went wrong.');
    }
  };

  return (
    <div className='formContainer formChanges card'>
    <form onSubmit={handleSubmit} className="profile-form updateProfileForm">
      <h3>UPDATE PROFILE</h3>

      {preview && 
        <div className='previewImgWrap'>
          <img src={preview} alt="Profile Preview" className="profile-preview" />
        </div> }
        
        <div className='form-group'>
          <label>
            Username:
            <input type="text" className='inputUsername form-control formInput updateInput' name="username" value={formData.username} onChange={handleChange} />
          </label>
        </div>

        <br />

        <div className='form-group'>
          <label>
            Email:
            <input type="email" className='inputEmail form-control formInput updateInput' name="email" value={formData.email} onChange={handleChange} />
          </label>
        </div>

        <br />

        <div className='form-group'>
          <label>
            Location:
            <input type="text" className='inputLocation form-control formInput updateInput' name="location" value={formData.location} onChange={handleChange} />
          </label>
        </div>

        <br />

        <div className='form-group'>
          <label>
            Bio:
            <textarea type="text" className='inputBio form-control formInput updateInput' name="bio" value={formData.bio} onChange={handleChange} />
          </label>
        </div>

        <br />

        <div className='form-group'>
          <label>
            Profile Photo:
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </label>
        </div>

        <button type="submit" className='btn saveButton'>Save Changes</button>
      {message && <p className="form-message">{message}</p>}
    </form>
    </div>
  );
}

export default ProfileForm;