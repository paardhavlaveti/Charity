import { motion } from 'framer-motion';

export function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '60%', height: '24px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}
              />
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                style={{ width: '20%', height: '24px', backgroundColor: 'var(--border-color)', borderRadius: '12px' }}
              />
            </div>
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              style={{ width: '100%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginTop: '0.5rem' }}
            />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              style={{ width: '80%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}
            />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
              style={{ width: '100%', height: '40px', backgroundColor: 'var(--border-color)', borderRadius: '8px', marginTop: 'auto' }}
            />
          </div>
        );
      case 'table-row':
        return (
          <div style={{ display: 'flex', padding: '1rem', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ flex: 2, height: '20px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} style={{ flex: 1, height: '20px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} style={{ flex: 1, height: '20px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: '100%' }}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
