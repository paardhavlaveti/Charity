import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Users, Package, CheckSquare } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../components/AnimatedCounter';

// Mock data for production-level chart
const mockTrendData = [
  { name: 'Jan', donations: 40, deliveries: 24 },
  { name: 'Feb', donations: 30, deliveries: 13 },
  { name: 'Mar', donations: 45, deliveries: 38 },
  { name: 'Apr', donations: 50, deliveries: 43 },
  { name: 'May', donations: 70, deliveries: 65 },
  { name: 'Jun', donations: 110, deliveries: 85 },
];

function ImpactDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/api/stats/global`);
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

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } }
        }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
          <Package size={32} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}><AnimatedCounter value={stats.totalItemsDonated} /></h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Total Items Donated</p>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--secondary)' }}>
          <CheckSquare size={32} color="var(--secondary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}><AnimatedCounter value={stats.totalItemsFulfilled} /></h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Successfully Delivered</p>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent)' }}>
          <Users size={32} color="var(--accent)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '3rem', margin: 0, color: 'var(--text-primary)' }}><AnimatedCounter value={stats.totalActiveNGOs} /></h2>
          <p className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 600 }}>Active NGOs & Receivers</p>
        </motion.div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Donation Growth</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={mockTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Legend />
                <Area type="monotone" dataKey="donations" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" name="Items Donated" />
                <Area type="monotone" dataKey="deliveries" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorDeliveries)" name="Items Delivered" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Donations by Category</h2>
          <div style={{ width: '100%', height: 350 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
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
    </div>
  );
}

export default ImpactDashboard;
