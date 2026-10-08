import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastContext';
import { AnimationProvider } from './components/AnimationOverlayContext';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <ToastProvider>
      <AnimationProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="page-wrapper animate-fade-in">
              <AnimatedRoutes />
            </main>
          </div>
        </Router>
      </AnimationProvider>
    </ToastProvider>
  );
}

export default App;
