import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ClaimKanbanCard } from './ClaimKanbanCard';

export function ClaimKanbanColumn({ id, title, claims }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        {title}
        <span className="kanban-column-count">{claims.length}</span>
      </div>
      
      <div className="kanban-items-container" ref={setNodeRef}>
        <SortableContext
          id={id}
          items={claims.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {claims.map((claim) => (
            <ClaimKanbanCard key={claim.id} claim={claim} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
