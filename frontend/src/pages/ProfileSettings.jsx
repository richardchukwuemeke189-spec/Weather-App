import DeleteAccountButton from '../components/DeleteAccountButton';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../style/profileSettings.css';

function ProfileSettings() {
  const { theme } = useTheme();

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1 className="settings-title">Settings</h1>

        {/* Profile Section */}
        <div className="settings-section">
          <div className="settings-info">
            <h3>Profile</h3>
            <p>Update your account information</p>
          </div>

          <Link to="/profileForm" className="primary-btn">
            Edit Profile
          </Link>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Security Section */}
        <div className="settings-section">
          <div className="settings-info">
            <h3>Security</h3>
            <p>Change your password</p>
          </div>

          <Link to="/changePasswordForm" className="primary-btn">
            Change Password
          </Link>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Danger Zone */}
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <DeleteAccountButton />
        </div>

        {/* Logout */}
        <div className="logout-wrap">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;