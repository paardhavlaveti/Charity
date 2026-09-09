import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Star, Award } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const API_URL = 'http://localhost:8080/api';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/leaderboard`);
        setLeaders(response.data);
      } catch (err) {
        addToast('Failed to load leaderboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [addToast]);

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Philanthropist': return <Trophy size={24} color="#8B5CF6" />;
      case 'Gold': return <Medal size={24} color="#F59E0B" />;
      case 'Silver': return <Medal size={24} color="#9CA3AF" />;
      case 'Bronze': return <Medal size={24} color="#B45309" />;
      default: return <Award size={24} color="var(--text-secondary)" />;
    }
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Philanthropist': return 'badge-primary';
      case 'Gold': return 'badge-warning';
      case 'Silver': return 'badge-secondary';
      case 'Bronze': return 'badge-error';
      default: return 'badge-secondary';
    }
  };

  if (loading) return <div className="container"><p>Loading Leaderboard...</p></div>;

  return (
    <div className="container dashboard-container" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
          <Star fill="var(--primary)" size={36} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', marginBottom: '6px' }}/> 
          Top Donors
        </h1>
        <p className="text-secondary">Celebrating our most generous community members.</p>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        {leaders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p className="text-secondary">No donors have fulfilled claims yet. Be the first!</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {leaders.map((leader, index) => (
              <li 
                key={leader.donorId} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1.5rem', 
                  borderBottom: index < leaders.length - 1 ? '1px solid var(--border-color)' : 'none',
                  backgroundColor: index === 0 ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '40px' }}>
                  #{index + 1}
                </div>
                
                <div style={{ flex: 1, paddingLeft: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {leader.donorName}
                    {index === 0 && <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--warning)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>#1 Overall</span>}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {getBadgeIcon(leader.badge)}
                    <span className={`badge ${getBadgeClass(leader.badge)}`}>{leader.badge}</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {leader.fulfilledItemsCount}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Items Donated
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
