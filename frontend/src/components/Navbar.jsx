import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Heart, User, ChevronDown, Settings, TrendingUp, Bell, Trophy, Shield } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsDropdownOpen(false);
    navigate('/auth');
  };

  const goToProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate(user.role === 'DONOR' ? '/donor' : '/receiver')}>
          <Heart className="brand-icon" />
          <span>Charity</span>
        </div>
        
        <div className="navbar-links">
          <Link to="/leaderboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginRight: '1rem' }}>
            <Trophy size={18} /> Top Donors
          </Link>
          
          <Link to="/impact" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginRight: '1rem' }}>
            <TrendingUp size={18} /> Impact
          </Link>

          {user.role === 'ADMIN' && (
            <Link to="/admin" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500, marginRight: '1rem' }}>
              <Shield size={18} /> Admin
            </Link>
          )}

          <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
            <Bell size={20} />
          </div>
          
          <span className={`badge badge-${user.role === 'DONOR' ? 'primary' : 'success'}`}>
            {user.role}
          </span>
          
          <div className="profile-menu-container" ref={dropdownRef}>
            <button 
              className="profile-menu-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="avatar-circle">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="avatar" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="user-greeting">{user.nameOrOrg}</span>
              <ChevronDown size={16} className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu animate-fade-in">
                <div className="dropdown-header">
                  <strong>{user.nameOrOrg}</strong>
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={goToProfile}>
                  <Settings size={16} />
                  <span>Edit Profile</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
