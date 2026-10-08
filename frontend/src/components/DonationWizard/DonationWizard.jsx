import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { StepCategory } from './StepCategory';
import { StepDetails } from './StepDetails';
import { StepLocation } from './StepLocation';
import { StepReview } from './StepReview';
import api from '../../services/api';
import { useToast } from '../ToastContext';
import { useAnimationOverlay } from '../AnimationOverlayContext';
import './DonationWizard.css';

export function DonationWizard({ onClose, onSuccess, user }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const { triggerAnimation } = useAnimationOverlay();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '1',
    category: '',
    subcategory: '',
    attributes: {},
    imageUrl: '',
    latitude: null,
    longitude: null,
    formattedAddress: ''
  });

  const handleNext = () => {
    setDirection(1);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const updateData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    if (!formData.latitude || !formData.longitude) {
      triggerAnimation('error', 'Please provide a valid location.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post(`/api/items`, formData);
      triggerAnimation('created', 'Yay Congratulations! Your donation is live.');
      onSuccess();
    } catch (error) {
      triggerAnimation('error', 'Failed to create donation. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Category' },
    { id: 2, title: 'Details' },
    { id: 3, title: 'Location' },
    { id: 4, title: 'Review' }
  ];

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 500 : -500, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? 500 : -500, opacity: 0 })
  };

  return (
    <div className="wizard-overlay">
      <motion.div 
        className="wizard-container glass-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="wizard-header">
          <div className="wizard-progress">
            {steps.map(s => (
              <div key={s.id} className={`progress-step ${step >= s.id ? 'active' : ''}`}>
                <div className="step-circle">{s.id}</div>
                <span className="step-label">{s.title}</span>
              </div>
            ))}
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="wizard-content">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              style={{ height: '100%' }}
            >
              {step === 1 && <StepCategory data={formData} updateData={updateData} onNext={handleNext} />}
              {step === 2 && <StepDetails data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
              {step === 3 && <StepLocation data={formData} updateData={updateData} onNext={handleNext} onBack={handleBack} />}
              {step === 4 && <StepReview data={formData} updateData={updateData} onBack={handleBack} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
