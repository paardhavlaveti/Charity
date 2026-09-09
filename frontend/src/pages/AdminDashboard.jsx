import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, ShieldCheck, Search, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const API_URL = 'http://localhost:8080/api';

function AdminDashboard() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const fetchNGOs = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/ngos`);
      setNgos(response.data);
    } catch (err) {
      addToast('Failed to load NGOs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNGOs();
  }, [addToast]);

  const handleVerifyToggle = async (ngoId, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/admin/ngos/${ngoId}/verify?verified=${!currentStatus}`);
      addToast(currentStatus ? 'NGO Verification Revoked' : 'NGO Verified Successfully', 'success');
      fetchNGOs();
    } catch (err) {
      addToast('Failed to update verification status', 'error');
    }
  };

  const filteredNgos = ngos.filter(ngo => 
    ngo.nameOrOrg.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ngo.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="container"><p>Loading Admin Dashboard...</p></div>;

  return (
    <div className="container dashboard-container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
            <Shield size={28} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/> 
            NGO Verification
          </h1>
          <p className="text-secondary" style={{ margin: 0 }}>Review and verify registered NGOs to build trust.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search NGOs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', paddingLeft: '8px', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Organization</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Contact Info</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNgos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No NGOs found.</td>
              </tr>
            ) : (
              filteredNgos.map((ngo) => (
                <tr key={ngo.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {ngo.nameOrOrg}
                      {ngo.verified && <ShieldCheck size={16} color="var(--primary)" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Joined recently</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    <div>{ngo.email}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{ngo.phone || 'No phone'}</div>
                    <div style={{ color: 'var(--text-secondary)' }}>{ngo.address || 'No address'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {ngo.verified ? (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        <CheckCircle size={14} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                        <XCircle size={14} /> Unverified
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleVerifyToggle(ngo.id, ngo.verified)}
                      className={`btn ${ngo.verified ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {ngo.verified ? 'Revoke Verification' : 'Verify NGO'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
