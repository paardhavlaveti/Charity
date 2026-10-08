import React, { createContext, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnimationContext = createContext();

// Reliable Framer Motion animations built with Emojis and SVGs
const StateAnimations = {
  created: () => (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl z-10"
      >
        🐇
      </motion.div>
      <motion.div
        animate={{ scale: [0, 1.5], opacity: [1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute text-6xl"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ scale: [0, 2], opacity: [1, 0], rotate: 45 }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        className="absolute text-5xl right-[-20px] top-[-20px]"
      >
        🎉
      </motion.div>
    </div>
  ),
  requested: () => (
    <motion.div
      animate={{ x: [-100, 100], y: [50, -50], scale: [0.5, 1.2, 0.8] }}
      transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
      className="text-8xl drop-shadow-lg"
    >
      ✈️
    </motion.div>
  ),
  approved: () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.4, 1], rotate: [0, 15, -10, 0] }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
      className="text-9xl drop-shadow-2xl"
    >
      🤝
    </motion.div>
  ),
  received: () => (
    <motion.div
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="text-9xl text-red-500 drop-shadow-xl"
    >
      💖
    </motion.div>
  ),
  error: () => (
    <motion.div
      animate={{ x: [-10, 10, -10, 10, 0] }}
      transition={{ duration: 0.5 }}
      className="text-8xl drop-shadow-xl"
    >
      😢
    </motion.div>
  ),
  empty: () => (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="text-8xl grayscale opacity-50"
    >
      👻
    </motion.div>
  )
};

export const AnimationProvider = ({ children }) => {
  const [animationState, setAnimationState] = useState({ isOpen: false, type: null, message: '' });

  const triggerAnimation = (type, message) => {
    setAnimationState({ isOpen: true, type, message });
    
    // Auto-close after 3.5 seconds
    setTimeout(() => {
      setAnimationState({ isOpen: false, type: null, message: '' });
    }, 3500);
  };

  const renderAnimation = (type) => {
    const AnimComponent = StateAnimations[type] || StateAnimations.created;
    return <AnimComponent />;
  };

  return (
    <AnimationContext.Provider value={{ triggerAnimation }}>
      {children}
      <AnimatePresence>
        {animationState.isOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
               initial={{ scale: 0.5, opacity: 0, y: 100 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.8, opacity: 0, y: -50 }}
               transition={{ type: "spring", damping: 15, stiffness: 200 }}
               className="bg-white/10 border border-white/20 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-white min-w-[350px] overflow-hidden relative"
            >
              {/* Animated glow background behind icon */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-3xl -z-10"
              />
              
              <div className="w-48 h-48 flex items-center justify-center mb-4">
                  {renderAnimation(animationState.type)}
              </div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mt-4 text-center tracking-wide drop-shadow-lg max-w-sm leading-tight"
              >
                {animationState.message}
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimationContext.Provider>
  );
};

export const useAnimationOverlay = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationOverlay must be used within an AnimationProvider');
  }
  return context;
};
