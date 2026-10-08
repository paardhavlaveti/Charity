import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Package, PlusCircle } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import { DndContext, DragOverlay, closestCorners, pointerWithin } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from '../components/Kanban/KanbanColumn';
import { KanbanCard } from '../components/Kanban/KanbanCard';
import { ChatWidget } from '../components/ChatWidget';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { DonationWizard } from '../components/DonationWizard/DonationWizard';
import '../components/Kanban/KanbanBoard.css';
import './Dashboard.css';
import { useAnimationOverlay } from '../components/AnimationOverlayContext';
import { motion } from 'framer-motion';

function DonorDashboard() {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [activeChatClaimId, setActiveChatClaimId] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const { addToast } = useToast();
  const { triggerAnimation } = useAnimationOverlay();

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(`/api/items/donor/${user.id}`);
      setItems(response.data);
      
      const claimsMap = {};
      for (const item of response.data) {
        const claimsRes = await api.get(`/api/claims/item/${item.id}`);
        claimsMap[item.id] = claimsRes.data;
      }
      setClaims(claimsMap);
    } catch (err) {
      triggerAnimation('error', 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user.id, triggerAnimation]);

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

  const handleApprove = async (claimId) => {
    try {
      await api.patch(`/api/claims/${claimId}/approve`);
      triggerAnimation('approved', 'Request Approved! A connection has been made.');
      fetchItems();
    } catch (err) {
      triggerAnimation('error', 'Failed to approve claim');
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

  if (loading) {
    return (
      <div className="container dashboard-container" style={{ maxWidth: '1400px' }}>
        <div style={{ height: '80px', marginBottom: '2rem' }}>
          <SkeletonLoader type="card" count={1} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', height: '500px' }}>
          <SkeletonLoader type="card" count={4} />
        </div>
      </div>
    );
  }

  const activeItem = items.find(i => i.id === activeId);

  return (
    <div className="container dashboard-container" style={{ maxWidth: '1400px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2><Package size={28} style={{ display: 'inline', verticalAlign: 'text-bottom', color: 'var(--primary)', marginRight: '8px' }} /> Your Inventory Board</h2>
        <button 
          onClick={() => setShowWizard(true)} 
          className="btn btn-primary"
        >
          <PlusCircle size={20} /> Create Donation
        </button>
      </div>

      {showWizard && (
        <DonationWizard 
          user={user} 
          onClose={() => setShowWizard(false)} 
          onSuccess={() => {
            setShowWizard(false);
            fetchItems();
          }} 
        />
      )}
      
      {items.length === 0 ? (
        <EmptyState 
          icon={Package} 
          title="No Donations Yet" 
          description="You haven't listed any items for donation. Create your first donation to start making an impact!"
          actionText="Create Donation"
          onAction={() => setShowWizard(true)}
        />
      ) : (
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
            <KanbanColumn id="available" title="Available" items={columns.available} claimsMap={claims} />
            <KanbanColumn id="requested" title="Requested" items={columns.requested} claimsMap={claims} />
            <KanbanColumn id="approved" title="Pending Pickup" items={columns.approved} claimsMap={claims} />
            <KanbanColumn id="fulfilled" title="Delivered" items={columns.fulfilled} claimsMap={claims} />
          </motion.div>

          <DragOverlay>
            {activeItem ? <KanbanCard item={activeItem} activeClaims={claims[activeItem.id]} isOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      )}

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
