import { ArrowRight, ArrowLeft } from 'lucide-react';

export function StepDetails({ data, updateData, onNext, onBack }) {
  
  const handleAttrChange = (key, value) => {
    updateData({
      attributes: { ...data.attributes, [key]: value }
    });
  };

  const renderDynamicFields = () => {
    if (data.category === 'CLOTHING') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Size</label>
            <select className="input-field" value={data.attributes?.size || ''} onChange={e => handleAttrChange('size', e.target.value)}>
              <option value="">Select Size...</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Gender</label>
            <select className="input-field" value={data.attributes?.gender || ''} onChange={e => handleAttrChange('gender', e.target.value)}>
              <option value="">Select Gender...</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>
      );
    }
    
    if (data.category === 'FOOD') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Dietary Type</label>
            <select className="input-field" value={data.attributes?.dietary || ''} onChange={e => handleAttrChange('dietary', e.target.value)}>
              <option value="">Select Type...</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Halal">Halal</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Any">Any</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Expiry Date</label>
            <input type="date" className="input-field" value={data.attributes?.expiry || ''} onChange={e => handleAttrChange('expiry', e.target.value)} />
          </div>
        </div>
      );
    }

    if (data.category === 'MEDICAL') {
      return (
        <div className="input-group">
          <label className="input-label">Prescription Required?</label>
          <select className="input-field" value={data.attributes?.prescription || ''} onChange={e => handleAttrChange('prescription', e.target.value)}>
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      );
    }

    return null;
  };

  const isComplete = data.title && data.description && data.quantity;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Item Details</h2>
        <p className="text-secondary">Provide specific information about your {data.category.toLowerCase()} donation.</p>
      </div>

      <div style={{ flex: 1 }}>
        <div className="input-group">
          <label className="input-label">Title</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="E.g., Winter Coats, Box of Canned Beans" 
            value={data.title}
            onChange={e => updateData({ title: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea 
            className="input-field" 
            placeholder="Describe the condition, features, etc." 
            rows={3}
            value={data.description}
            onChange={e => updateData({ description: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Quantity</label>
          <input 
            type="number" 
            className="input-field" 
            min="1"
            value={data.quantity}
            onChange={e => updateData({ quantity: e.target.value })}
          />
        </div>

        <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Specifics</h4>
        {renderDynamicFields()}
      </div>

      <div className="wizard-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onNext}
          disabled={!isComplete}
        >
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
