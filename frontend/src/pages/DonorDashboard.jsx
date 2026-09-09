import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Package, PlusCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { DndContext, DragOverlay, closestCorners, pointerWithin } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from '../components/Kanban/KanbanColumn';
import { KanbanCard } from '../components/Kanban/KanbanCard';
import { ChatWidget } from '../components/ChatWidget';
import { MapLocationPicker } from '../components/MapLocationPicker';
import '../components/Kanban/KanbanBoard.css';
import './Dashboard.css';

const API_URL = 'http://localhost:8080/api';

function DonorDashboard() {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeChatClaimId, setActiveChatClaimId] = useState(null);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    category: 'CLOTHING',
    imageUrl: ''
  });
  const [position, setPosition] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/items/donor/${user.id}`);
      setItems(response.data);
      
      const claimsMap = {};
      for (const item of response.data) {
        const claimsRes = await axios.get(`${API_URL}/claims/item/${item.id}`);
        claimsMap[item.id] = claimsRes.data;
      }
      setClaims(claimsMap);
    } catch (err) {
      addToast('Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [user.id, addToast]);

  useEffect(() => {
    fetchItems();

    const handleOpenChat = (e) => {
      setActiveChatClaimId(e.detail);
    };
    window.addEventListener('openChat', handleOpenChat);

    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, [fetchItems]);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!position) {
      addToast('Please select a location on the map.', 'warning');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        latitude: position.lat,
        longitude: position.lng
      };
      
      await axios.post(`${API_URL}/items`, payload, {
        headers: { 'X-User-Id': user.id }
      });
      setFormData({ title: '', description: '', quantity: '', category: 'CLOTHING', imageUrl: '' });
      setPosition(null);
      addToast('Item listed successfully!', 'success');
      fetchItems();
    } catch (err) {
      addToast('Failed to create item', 'error');
    }
  };

  const handleApprove = async (claimId) => {
    try {
      await axios.patch(`${API_URL}/claims/${claimId}/approve`);
      addToast('Claim approved successfully!', 'success');
      fetchItems();
    } catch (err) {
      addToast('Failed to approve claim', 'error');
    }
  };

  // Categorize items into columns
  const getColumnForItems = () => {
    const columns = {
      available: [],
      requested: [],
      approved: [],
      fulfilled: []
    };

    items.forEach(item => {
      const itemClaims = claims[item.id] || [];
      const hasRequested = itemClaims.some(c => c.status === 'REQUESTED');
      const hasApproved = itemClaims.some(c => c.status === 'APPROVED');
      const hasFulfilled = itemClaims.some(c => c.status === 'FULFILLED');

      if (hasFulfilled || item.status === 'CLAIMED') {
        columns.fulfilled.push(item);
      } else if (hasApproved) {
        columns.approved.push(item);
      } else if (hasRequested) {
        columns.requested.push(item);
      } else {
        columns.available.push(item);
      }
    });

    return columns;
  };

  const columns = getColumnForItems();

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const itemId = active.id;
    const overId = over.id; // Either a column id or another item id
    
    // Find what column we dropped into
    let targetColumnId = overId;
    if (overId !== 'available' && overId !== 'requested' && overId !== 'approved' && overId !== 'fulfilled') {
      // Find the column containing the hovered item
      Object.entries(columns).forEach(([key, colItems]) => {
        if (colItems.find(i => i.id === overId)) targetColumnId = key;
      });
    }

    // Logic to handle moving
    const itemClaims = claims[itemId] || [];
    
    if (targetColumnId === 'approved') {
      // Find the first requested claim to approve
      const claimToApprove = itemClaims.find(c => c.status === 'REQUESTED');
      if (claimToApprove) {
        await handleApprove(claimToApprove.id);
      } else {
        addToast('No pending requests to approve for this item.', 'warning');
      }
    } else if (targetColumnId === 'available') {
        addToast('Cannot move an item back to Available manually.', 'warning');
    } else if (targetColumnId === 'requested') {
        addToast('Items automatically move here when requested.', 'warning');
    } else if (targetColumnId === 'fulfilled') {
        addToast('Receivers must mark items as received to fulfill them.', 'warning');
    }
  };

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>;

  const activeItem = items.find(i => i.id === activeId);

  return (
    <div className="container dashboard-container" style={{ maxWidth: '1400px' }}>
      
      <div className="donate-section glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PlusCircle size={24} /> Add New Donation</h2>
        <form onSubmit={handleDonate} className="donate-form" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="input-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
            <label className="input-label">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" required />
          </div>
          <div className="input-group" style={{ flex: '1', minWidth: '150px', marginBottom: 0 }}>
            <label className="input-label">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field">
              <option value="CLOTHING">Clothing</option>
              <option value="FOOD">Food</option>
              <option value="ELECTRONICS">Electronics</option>
              <option value="MEDICAL">Medical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="input-group" style={{ flex: '0.5', minWidth: '100px', marginBottom: 0 }}>
            <label className="input-label">Qty</label>
            <input type="text" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="input-field" required />
          </div>
          <div className="input-group" style={{ flex: '2', minWidth: '300px', marginBottom: 0 }}>
            <label className="input-label">Description</label>
            <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" required />
          </div>
          
          <div style={{ width: '100%', marginBottom: '1rem' }}>
            <label className="input-label">Item Location (Click to drop pin)</label>
            <MapLocationPicker position={position} setPosition={setPosition} />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ height: '42px', width: '100%' }}>List Item</button>
        </form>
      </div>

      <h2 style={{ marginBottom: '1rem' }}><Package size={24} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Your Inventory Board</h2>
      
      <DndContext 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-container">
          <KanbanColumn id="available" title="Available" items={columns.available} claimsMap={claims} />
          <KanbanColumn id="requested" title="Requested" items={columns.requested} claimsMap={claims} />
          <KanbanColumn id="approved" title="Pending Pickup" items={columns.approved} claimsMap={claims} />
          <KanbanColumn id="fulfilled" title="Delivered" items={columns.fulfilled} claimsMap={claims} />
        </div>

        <DragOverlay>
          {activeItem ? <KanbanCard item={activeItem} activeClaims={claims[activeItem.id]} /> : null}
        </DragOverlay>
      </DndContext>

      {activeChatClaimId && (
        <ChatWidget 
          claimId={activeChatClaimId} 
          user={user} 
          onClose={() => setActiveChatClaimId(null)} 
        />
      )}
    </div>
  );
}

export default DonorDashboard;
