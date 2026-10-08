import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Heart, User, ChevronDown, Settings, TrendingUp, Bell, Trophy, Shield, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Force re-render on route change
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  
  // Read user from localStorage on every render (which now includes route changes)
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/auth'); // Use react-router to avoid 404 on deployment
  };

  const goToProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your donation of 'Winter Coats' was requested!", time: "2 hours ago", unread: true },
    { id: 2, text: "A new NGO has joined CharityBridge in your area.", time: "1 day ago", unread: false },
    { id: 3, text: "Your impact score has increased by 50 points!", time: "3 days ago", unread: false },
  ]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

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

          <motion.div 
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center', width: '20px', height: '20px' }}
            title="Toggle Dark Mode"
            whileTap={{ scale: 0.8 }}
          >
            <AnimatePresence mode="wait">
              {isDarkMode ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ position: 'absolute' }}>
                  <Sun size={20} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} style={{ position: 'absolute' }}>
                  <Moon size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="profile-menu-container" ref={notificationRef}>
            <div 
              style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)', marginRight: '1rem', display: 'flex', alignItems: 'center' }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--error)', width: '10px', height: '10px', borderRadius: '50%' }}></span>
              )}
            </div>
            
            {isNotificationOpen && (
              <div className="dropdown-menu animate-fade-in" style={{ width: '320px', right: '1rem', padding: '0' }}>
                <div className="dropdown-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h4>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.map(notif => (
                    <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: notif.unread ? 'var(--bg-surface-elevated)' : 'transparent', cursor: 'pointer' }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.text}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div 
                  style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', cursor: 'pointer' }}
                  onClick={markAllAsRead}
                >
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>Mark all as read</span>
                </div>
              </div>
            )}
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
