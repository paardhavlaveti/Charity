import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Search, MapPin, HandHeart, CheckCircle, Clock, MessageCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { ClaimKanbanColumn } from '../components/Kanban/ClaimKanbanColumn';
import { ClaimKanbanCard } from '../components/Kanban/ClaimKanbanCard';
import { ChatWidget } from '../components/ChatWidget';
import { MapView } from '../components/MapView';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import '../components/Kanban/KanbanBoard.css';
import './Dashboard.css';
import { useAnimationOverlay } from '../components/AnimationOverlayContext';
import { motion } from 'framer-motion';

function ReceiverDashboard() {
  const [availableItems, setAvailableItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeChatClaimId, setActiveChatClaimId] = useState(null);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  
  const [requestMessage, setRequestMessage] = useState({});
  const { addToast } = useToast();
  const { triggerAnimation } = useAnimationOverlay();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchData = useCallback(async () => {
    try {
      let url = `/api/items`;
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category', categoryFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const itemsRes = await api.get(url);
      setAvailableItems(itemsRes.data);

      const claimsRes = await api.get(`/api/claims/receiver/${user.id}`);
      setMyClaims(claimsRes.data);
    } catch (err) {
      triggerAnimation('error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.id, categoryFilter, locationFilter, triggerAnimation]);

  useEffect(() => {
    fetchData();

    const handleOpenChat = (e) => {
      setActiveChatClaimId(e.detail);
    };
    window.addEventListener('openChat', handleOpenChat);

    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, [fetchData]);

  const handleRequest = async (itemId) => {
    if (!requestMessage[itemId]) {
      addToast("Please provide a reason for your request.", "warning");
      return;
    }
    
    try {
      await api.post(`/api/claims`, {
        itemId: itemId,
        message: requestMessage[itemId]
      });
      
      setRequestMessage({ ...requestMessage, [itemId]: '' });
      triggerAnimation('requested', 'Request sent! The donor has been notified.');
      fetchData();
    } catch (err) {
      triggerAnimation('error', err.response?.data?.message || 'Failed to request item');
    }
  };

  const handleFulfill = async (claimId) => {
    try {
      await api.patch(`/api/claims/${claimId}/fulfill`);
      triggerAnimation('received', 'Successfully Received! Thank you.');
      fetchData();
    } catch (err) {
      triggerAnimation('error', 'Failed to mark item as received');
    }
  };

  const handleMessageChange = (itemId, val) => {
    setRequestMessage({ ...requestMessage, [itemId]: val });
  };

  // Categorize claims for Kanban
  const getColumnsForClaims = () => {
    const cols = {
      requested: [],
      approved: [],
      fulfilled: []
    };

    myClaims.forEach(claim => {
      if (claim.status === 'REQUESTED') cols.requested.push(claim);
      else if (claim.status === 'APPROVED') cols.approved.push(claim);
      else if (claim.status === 'FULFILLED') cols.fulfilled.push(claim);
      // Rejected claims can be hidden from the kanban or put in a 4th column. Let's hide them for cleaner board.
    });

    return cols;
  };

  const columns = getColumnsForClaims();

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const claimId = active.id;
    const overId = over.id;
    
    let targetColumnId = overId;
    if (overId !== 'requested' && overId !== 'approved' && overId !== 'fulfilled') {
      Object.entries(columns).forEach(([key, colItems]) => {
        if (colItems.find(c => c.id === overId)) targetColumnId = key;
      });
    }

    if (targetColumnId === 'fulfilled') {
      const claim = myClaims.find(c => c.id === claimId);
      if (claim && claim.status === 'APPROVED') {
        await handleFulfill(claimId);
      } else if (claim && claim.status === 'REQUESTED') {
        addToast('The donor must approve the request first.', 'warning');
      }
    } else if (targetColumnId === 'approved') {
        addToast('Only the Donor can approve requests.', 'warning');
    } else if (targetColumnId === 'requested') {
        addToast('Cannot move a claim back to requested.', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="container dashboard-container" style={{ maxWidth: '1400px' }}>
        <div style={{ height: '80px', marginBottom: '2rem' }}>
          <SkeletonLoader type="card" count={1} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', height: '400px' }}>
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    );
  }

  const activeClaim = myClaims.find(c => c.id === activeId);

  return (
    <div className="container dashboard-container" style={{ maxWidth: '1400px' }}>
      
      {/* Top Section: Kanban Board */}
      <h2 style={{ marginBottom: '1rem' }}><CheckCircle size={24} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Your Request Board</h2>
      
      <div style={{ marginBottom: '3rem' }}>
        <DndContext 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <motion.div 
            className="kanban-container"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            <ClaimKanbanColumn id="requested" title="Awaiting Approval" claims={columns.requested} />
            <ClaimKanbanColumn id="approved" title="Ready for Pickup" claims={columns.approved} />
            <ClaimKanbanColumn id="fulfilled" title="Received" claims={columns.fulfilled} />
          </motion.div>

          <DragOverlay>
            {activeClaim ? <ClaimKanbanCard claim={activeClaim} isOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {activeChatClaimId && (
        <ChatWidget 
          claimId={activeChatClaimId} 
          user={user} 
          onClose={() => setActiveChatClaimId(null)} 
        />
      )}

      <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

      {/* Bottom Section: Browse Donations */}
      <div className="transactions-section">
        <h2><Search size={24} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Browse Donations</h2>
        
        <div className="filters-bar glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)} 
            className="input-field" 
            style={{ width: 'auto', marginBottom: 0 }}
          >
            <option value="">All Categories</option>
            <option value="CLOTHING">Clothing</option>
            <option value="FOOD">Food</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="MEDICAL">Medical</option>
            <option value="OTHER">Other</option>
          </select>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <MapPin size={20} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Filter by city..." 
              value={locationFilter} 
              onChange={e => setLocationFilter(e.target.value)} 
              className="input-field" 
              style={{ marginBottom: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setViewMode('list')} 
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')} 
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem' }}
            >
              Map View
            </button>
          </div>
          
          <button onClick={fetchData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Apply</button>
        </div>

        {availableItems.length === 0 ? (
          <EmptyState 
            icon={Search} 
            title="No Items Found" 
            description="We couldn't find any donations matching your criteria."
            actionText="Clear Filters"
            onAction={() => {
              setCategoryFilter('');
              setLocationFilter('');
              fetchData();
            }}
          />
        ) : viewMode === 'map' ? (
          <MapView 
            items={availableItems} 
            myClaims={myClaims} 
            onMessageChange={handleMessageChange} 
            requestMessage={requestMessage} 
            onRequest={handleRequest} 
          />
        ) : (
          <div className="items-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {availableItems.map(item => {
              const alreadyRequested = myClaims.some(c => c.itemId === item.id);

              return (
                <div key={item.id} className="item-card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="item-header">
                    <h3>{item.title}</h3>
                    <span className="badge badge-primary">{item.category}</span>
                  </div>
                  <p className="item-meta">Donor Location: {item.donorCity || 'Unknown'} • Qty: {item.quantity}</p>
                  <p className="item-desc" style={{ flex: 1 }}>{item.description}</p>
                  
                  {!alreadyRequested ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      <input 
                        type="text" 
                        placeholder="Why do you need this?" 
                        className="input-field"
                        value={requestMessage[item.id] || ''}
                        onChange={(e) => handleMessageChange(item.id, e.target.value)}
                      />
                      <button 
                        onClick={() => handleRequest(item.id)} 
                        className="btn btn-primary w-full"
                      >
                        <HandHeart size={18} /> Request Item
                      </button>
                    </div>
                  ) : (
                    <div className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '1rem', padding: '0.5rem' }}>
                      <Clock size={14} /> Already Requested
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiverDashboard;
