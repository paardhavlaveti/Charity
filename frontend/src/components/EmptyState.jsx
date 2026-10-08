import { motion } from 'framer-motion';

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel" 
      style={{ 
        padding: '3rem 2rem', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '1rem'
      }}
    >
      {Icon && (
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-surface-elevated)', 
            borderRadius: '50%', 
            color: 'var(--primary)', 
            marginBottom: '0.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Icon size={56} />
        </motion.div>
      )}
      <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 0 1rem 0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </motion.div>
  );
}
