import { ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';

export function StepReview({ data, updateData, onBack, onSubmit, isSubmitting }) {
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2>Review & Publish</h2>
        <p className="text-secondary">Double check your details before making this item available to the world.</p>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Item Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Title</span>
              <span style={{ fontWeight: 600 }}>{data.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Category</span>
              <span className="badge badge-primary">{data.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Quantity</span>
              <span style={{ fontWeight: 600 }}>{data.quantity}</span>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <span className="text-secondary" style={{ display: 'block', marginBottom: '0.25rem' }}>Location</span>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>{data.formattedAddress}</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
           <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ margin: '0 0 1rem 0' }}>Item Photo</h3>
             <div style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-surface-elevated)' }}>
                {data.imageUrl ? (
                  <img src={data.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <>
                    <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p className="text-secondary text-sm">Provide an image URL below</p>
                  </>
                )}
             </div>
             <input 
                type="text" 
                className="input-field" 
                placeholder="https://example.com/image.jpg" 
                value={data.imageUrl}
                onChange={e => updateData({ imageUrl: e.target.value })}
                style={{ marginTop: '1rem' }}
              />
           </div>
        </div>
      </div>

      <div className="wizard-footer">
        <button className="btn btn-secondary" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={18} /> Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
        >
          {isSubmitting ? 'Publishing...' : <><CheckCircle size={18} /> Publish Donation</>}
        </button>
      </div>
    </div>
  );
}
