import { Shirt, Apple, Monitor, HeartPulse, PackageOpen, ArrowRight } from 'lucide-react';

export function StepCategory({ data, updateData, onNext }) {
  const categories = [
    { id: 'CLOTHING', label: 'Clothing', icon: Shirt, color: '#3B82F6' },
    { id: 'FOOD', label: 'Food', icon: Apple, color: '#10B981' },
    { id: 'ELECTRONICS', label: 'Electronics', icon: Monitor, color: '#8B5CF6' },
    { id: 'MEDICAL', label: 'Medical', icon: HeartPulse, color: '#EF4444' },
    { id: 'OTHER', label: 'Other', icon: PackageOpen, color: '#F59E0B' }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2>What would you like to donate?</h2>
        <p className="text-secondary">Select the category that best fits your item.</p>
      </div>

      <div className="category-grid">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = data.category === cat.id;
          return (
            <div 
              key={cat.id} 
              className={`category-card ${isSelected ? 'selected' : ''}`}
              onClick={() => updateData({ category: cat.id, subcategory: '', attributes: {} })}
            >
              <Icon size={48} color={cat.color} />
              <span>{cat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="wizard-footer">
        <div></div>
        <button 
          className="btn btn-primary" 
          onClick={onNext}
          disabled={!data.category}
        >
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
