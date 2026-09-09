import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nameOrOrg: '',
    phone: '',
    address: '',
    profileImageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/auth');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    setFormData({
      nameOrOrg: userData.nameOrOrg || '',
      phone: userData.phone || '',
      address: userData.address || '',
      profileImageUrl: userData.profileImageUrl || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container profile-container">
      <div className="glass-panel profile-panel animate-fade-in">
        <h2>Edit Profile</h2>
        <p className="text-secondary mb-4">Update your account information.</p>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-section">
             <div className="avatar-preview">
                {formData.profileImageUrl ? (
                  <img src={formData.profileImageUrl} alt="Profile Preview" />
                ) : (
                  <div className="avatar-placeholder">{formData.nameOrOrg.charAt(0).toUpperCase()}</div>
                )}
             </div>
             <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Profile Image URL</label>
                <input
                  type="text"
                  name="profileImageUrl"
                  className="input-field"
                  placeholder="https://example.com/avatar.png"
                  value={formData.profileImageUrl}
                  onChange={handleChange}
                />
                <small className="text-secondary">Provide a direct URL to an image.</small>
             </div>
          </div>

          <div className="input-group">
            <label className="input-label">Name or Organization</label>
            <input
              type="text"
              name="nameOrOrg"
              className="input-field"
              value={formData.nameOrOrg}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <input
              type="text"
              name="address"
              className="input-field"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
