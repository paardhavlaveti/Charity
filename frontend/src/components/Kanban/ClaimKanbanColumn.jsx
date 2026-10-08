import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ClaimKanbanCard } from './ClaimKanbanCard';
import { motion } from 'framer-motion';

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function ClaimKanbanColumn({ id, title, claims }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <motion.div variants={columnVariants} className="kanban-column">
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
    </motion.div>
  );
}
