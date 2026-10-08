import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { motion } from 'framer-motion';

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function KanbanColumn({ id, title, items, claimsMap }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <motion.div variants={columnVariants} className="kanban-column">
      <div className="kanban-column-header">
        {title}
        <span className="kanban-column-count">{items.length}</span>
      </div>
      
      <div className="kanban-items-container" ref={setNodeRef}>
        <SortableContext
          id={id}
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <KanbanCard key={item.id} item={item} activeClaims={claimsMap[item.id]} />
          ))}
        </SortableContext>
      </div>
    </motion.div>
  );
}
