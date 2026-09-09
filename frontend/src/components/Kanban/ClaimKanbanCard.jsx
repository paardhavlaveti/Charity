import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Package, CheckCircle, HandHeart, MessageCircle } from 'lucide-react';

export function ClaimKanbanCard({ claim }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: claim.id, data: { ...claim } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card-title">{claim.itemTitle}</div>
      <div className="kanban-card-meta">
        <Package size={14} style={{ display: 'inline', marginRight: '4px' }} />
        Requested by you
      </div>

      <div className="kanban-card-meta" style={{ fontStyle: 'italic', marginBottom: '8px' }}>
        "{claim.message}"
      </div>

      {claim.status === 'REQUESTED' && (
        <div className="claim-indicator" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)' }}>
          <HandHeart size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Awaiting Donor Approval
        </div>
      )}

      {(claim.status === 'APPROVED' || claim.status === 'FULFILLED') && claim.donorName && (
        <div className="claim-indicator" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div><CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Donor: {claim.donorName}</div>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'fit-content' }}
            onPointerDown={(e) => {
              e.stopPropagation(); // Prevent drag start
              // Dispatch a custom event that the dashboard can listen to, or pass down a prop
              window.dispatchEvent(new CustomEvent('openChat', { detail: claim.id }));
            }}
          >
            <MessageCircle size={14} /> Open Chat
          </button>
        </div>
      )}

      {claim.status === 'REJECTED' && (
        <div className="claim-indicator" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
          Rejected
        </div>
      )}
    </div>
  );
}
