import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../style/functionBtn.css'

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <button onClick={handleLogout} className="btn logout-account-btn">
      Logout
    </button>
  );
}

export default LogoutButton;