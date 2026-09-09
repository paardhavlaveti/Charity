import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/ToastContext';
import './Auth.css';

const API_URL = 'http://localhost:8080/api/users';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'DONOR',
    nameOrOrg: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      
      // Save user session
      localStorage.setItem('user', JSON.stringify(response.data));
      
      addToast(isLogin ? 'Login successful!' : 'Registration successful!', 'success');
      
      // Redirect based on role
      if (response.data.role === 'DONOR') {
        navigate('/donor');
      } else {
        navigate('/receiver');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Login to continue your journey of giving and receiving.' : 'Join Antigravity and make a difference today.'}</p>
        </div>



        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label">I am a...</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange} 
                  className="input-field"
                >
                  <option value="DONOR">Donor</option>
                  <option value="NGO">NGO</option>
                  <option value="INDIVIDUAL">Individual in Need</option>
                </select>
              </div>
              
              <div className="input-group">
                <label className="input-label">Name / Organization</label>
                <input 
                  type="text" 
                  name="nameOrOrg" 
                  value={formData.nameOrOrg} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                />
              </div>

              <div className="input-group">
                <label className="input-label">City / Location</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="input-field" 
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="input-field" 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-btn" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
