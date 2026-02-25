import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../style/profileForm.css'
import '../style/form.css'

function ChangePasswordForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      toast.error('New password do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_USER_URL}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        // setMessage('Password updated successfully!');
        toast.success('Password updated successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        console.error(data.error || 'Password update failed.');
      }
    } catch (err) {
      console.error('Password update error:', err);
      toast.error('Something went wrong!')
    }
  };

  return (
    <div className='formContainer formChanges card' style={{marginTop:'100px'}}>
    <form onSubmit={handleSubmit} className="change-password-form">
      <h3>Change Password</h3>

      <label>
        Current Password:
        <input type="password" className='form-control formInput updateInput' name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
      </label>

      <label>
        New Password:
        <input type="password" className='form-control formInput updateInput' name="newPassword" value={formData.newPassword} onChange={handleChange} />
      </label>

      <label>
        Confirm New Password:
        <input type="password" className='form-control formInput updateInput' name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
      </label>

      <button type="submit">Update Password</button>
      {message && <p className="form-message">{message}</p>}
    </form>
    </div>
  );
}

export default ChangePasswordForm;