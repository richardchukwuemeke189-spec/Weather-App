import { useNavigate } from 'react-router-dom';
import '../style/functionBtn.css'

function DeleteAccountButton() {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');

    try {
      // const res = await fetch(`${import.meta.env.VITE_USER_URL}/delete`, {
      const res = await fetch(`https://weather-backend-001h.onrender.com/api/user/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        localStorage.removeItem('token');
        navigate('/register');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <button onClick={handleDelete} className="btn delete-account-btn">
      Delete My Account
    </button>
  );
}

export default DeleteAccountButton;