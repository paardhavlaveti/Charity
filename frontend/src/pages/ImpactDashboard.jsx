import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Package, CheckSquare } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const API_URL = 'https://charity-backend-91q6.onrender.com/api';

function ImpactDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats/global`);
        setStats(response.data);
      } catch (err) {
        addToast('Failed to load impact statistics.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [addToast]);

  if (loading) return <div className="container"><p>Loading Impact Data...</p></div>;
  if (!stats) return null;

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];
  
  // Convert map to array for Recharts
  const pieData = Object.keys(stats.itemsByCategory).map(key => ({
    name: key,
    value: stats.itemsByCategory[key]
  }));

  return (
    <div className="container dashboard-container">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}><TrendingUp size={36} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }}/> Our Global Impact</h1>
        <p className="text-secondary">See how the Charity community is making a difference.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
          <Package size={32} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}>{stats.totalItemsDonated}</h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Total Items Donated</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
          <CheckSquare size={32} color="var(--secondary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}>{stats.totalItemsFulfilled}</h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Successfully Delivered</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
          <Users size={32} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}>{stats.totalActiveNGOs}</h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Active NGOs & Receivers</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Donations by Category</h2>
        <div style={{ width: '100%', height: 400 }}>
          {pieData.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-primary)' }} 
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-secondary" style={{ textAlign: 'center', marginTop: '4rem' }}>No categorization data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImpactDashboard;
