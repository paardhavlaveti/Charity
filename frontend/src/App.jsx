import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import DonorDashboard from './pages/DonorDashboard';
import ReceiverDashboard from './pages/ReceiverDashboard';
import { ToastProvider } from './components/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import ImpactDashboard from './pages/ImpactDashboard';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="page-wrapper animate-fade-in">
            <Routes>
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/donor" 
                element={
                  <ProtectedRoute allowedRoles={['DONOR']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/receiver" 
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'INDIVIDUAL']}>
                    <ReceiverDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['DONOR', 'NGO', 'INDIVIDUAL']}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/impact" 
                element={<ImpactDashboard />} 
              />
              <Route 
                path="/leaderboard" 
                element={<Leaderboard />} 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
