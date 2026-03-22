import { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/HomePage'
import Login from './pages/Login'
import { useTheme } from './context/ThemeContext'
import SearchPage from './pages/SearchPage'
import Profile from './pages/Profile'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NetworkStatus from './components/NetworkStatus'
import PrivateRoute from './components/PrivateRoute'
import ProfileSettings from './pages/ProfileSettings'
import ProfileForm from './components/ProfileForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import ExploreCities from './pages/ExploreCities'
import FavoriteCities from './components/FavoriteCities'

function App() {

  const {themeMode} = useTheme();

  useEffect(() => { 
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  return (
    <BrowserRouter>
      <NetworkStatus />
      <Navbar />
      <div className='main-content'>
      <Routes>
        {/* Public routes */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}

        {/* Protected routes */}
        <Route
          path="/"
          element={
            // <PrivateRoute>
              <Home />
            // </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            // <PrivateRoute>
              <Profile />
            // </PrivateRoute>
          }
        />

        <Route
          path="/exploreCities"
          element={
            // <PrivateRoute>
              <ExploreCities />
            // </PrivateRoute>
          }
        />

        <Route 
        path="/weather/:city" 
        element={
          // <PrivateRoute>
            <Home />
          // </PrivateRoute>
          } 
        />

        <Route
        path='/profileSettings'
        element={
          // <PrivateRoute>
            <ProfileSettings />
          // </PrivateRoute>
          }
        />

        <Route
        path='/favoriteCities'
        element={
          // <PrivateRoute>
            <FavoriteCities />
          // </PrivateRoute>
          }
        />

        <Route
        path='/profileForm'
        element={
          // <PrivateRoute>
            <ProfileForm />
          // </PrivateRoute>
        }
        />

        <Route
        path='/changePasswordForm'
        element={
          // <PrivateRoute>
            <ChangePasswordForm />
          // </PrivateRoute>
        }
        />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  )
}

export default App