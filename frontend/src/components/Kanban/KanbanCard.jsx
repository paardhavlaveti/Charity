import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Package, Clock, CheckCircle, MessageCircle, ShieldCheck } from 'lucide-react';

export function KanbanCard({ item, activeClaims }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, data: { ...item } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const pendingCount = activeClaims ? activeClaims.filter(c => c.status === 'REQUESTED').length : 0;
  const approvedClaim = activeClaims ? activeClaims.find(c => c.status === 'APPROVED' || c.status === 'FULFILLED') : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card-title">{item.title}</div>
      <div className="kanban-card-meta">
        <Package size={14} style={{ display: 'inline', marginRight: '4px' }} />
        Qty: {item.quantity} • {item.category}
      </div>

      {pendingCount > 0 && !approvedClaim && (
        <div className="claim-indicator" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)' }}>
          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {pendingCount} Request(s) Pending
        </div>
      )}

      {approvedClaim && (
        <div className="claim-indicator" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={12} style={{ display: 'inline' }} />
            Approved for: {approvedClaim.receiverName || 'NGO'}
            {approvedClaim.receiverVerified && <ShieldCheck size={14} color="var(--primary)" />}
          </div>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'fit-content' }}
            onPointerDown={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('openChat', { detail: approvedClaim.id }));
            }}
          >
            <MessageCircle size={14} /> Open Chat
          </button>
        </div>
      )}
    </div>
  );
}
