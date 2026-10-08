import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Auth from '../pages/Auth';
import DonorDashboard from '../pages/DonorDashboard';
import ReceiverDashboard from '../pages/ReceiverDashboard';
import ProtectedRoute from './ProtectedRoute';
import Profile from '../pages/Profile';
import ImpactDashboard from '../pages/ImpactDashboard';
import Leaderboard from '../pages/Leaderboard';
import AdminDashboard from '../pages/AdminDashboard';

// Define the page transition animation
const pageVariants = {
  initial: { opacity: 0, x: -20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 20, scale: 0.98 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        <Route path="/auth" element={
          <AnimatedPage><Auth /></AnimatedPage>
        } />
        
        <Route path="/donor" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <AnimatedPage><DonorDashboard /></AnimatedPage>
          </ProtectedRoute>
        } />
        
        <Route path="/receiver" element={
          <ProtectedRoute allowedRoles={['NGO', 'INDIVIDUAL']}>
            <AnimatedPage><ReceiverDashboard /></AnimatedPage>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['DONOR', 'NGO', 'INDIVIDUAL']}>
            <AnimatedPage><Profile /></AnimatedPage>
          </ProtectedRoute>
        } />
        
        <Route path="/impact" element={
          <AnimatedPage><ImpactDashboard /></AnimatedPage>
        } />
        
        <Route path="/leaderboard" element={
          <AnimatedPage><Leaderboard /></AnimatedPage>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AnimatedPage><AdminDashboard /></AnimatedPage>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}
