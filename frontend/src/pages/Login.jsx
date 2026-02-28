import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/form.css'

function Login() {
  const params = new URLSearchParams(window.location.search); 
  const registered = params.get('registered');
  const [message, setMessage] = useState('');

  useEffect(() => { if (registered) { 
    setMessage('🎉 Account created! Please log in.'); 
  } }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      const res = await fetch(`https://weather-backend-001h.onrender.com/api/auth
/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home/dashboard
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
    <div className='formContainer card'>
      <h2>WELCOME BACK</h2>
      <h6>LOGIN INTO YOUR ACCOUNT</h6>
      <form onSubmit={handleLogin}>
        {/* <h2>Login</h2> */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='formWrap'>
          <input
            className='inputEmail form-control formInput'
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='formWrap'>
          <input
            className='inputPassword form-control formInput'
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className='submitBtn btn loginBtn' type="submit">LOGIN</button>
        <p className='mt-2'>Don't have an account yet? <Link to='/register' style={{fontWeight:'bold'}}>Sign Up</Link></p>
      </form>
    </div>
    </div>
  );
}

export default Login;