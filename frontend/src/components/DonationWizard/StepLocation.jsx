import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, MapPin } from 'lucide-react';
import { MapLocationPicker } from '../MapLocationPicker';

export function StepLocation({ data, updateData, onNext, onBack }) {
  const [position, setPosition] = useState(data.latitude ? { lat: data.latitude, lng: data.longitude } : null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (position && (position.lat !== data.latitude || position.lng !== data.longitude)) {
      // Reverse Geocode
      const fetchAddress = async () => {
        setIsGeocoding(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
          const geoData = await res.json();
          updateData({
            latitude: position.lat,
            longitude: position.lng,
            formattedAddress: geoData.display_name
          });
        } catch (err) {
          console.error("Geocoding failed", err);
          updateData({
            latitude: position.lat,
            longitude: position.lng,
            formattedAddress: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
          });
        } finally {
          setIsGeocoding(false);
        }
      };
      fetchAddress();
    }
  }, [position]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Pickup Location</h2>
        <p className="text-secondary">Where can the NGO or Receiver pick up this item?</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <MapLocationPicker position={position} setPosition={setPosition} />
        </div>

        {data.formattedAddress && (
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--primary)' }}>
            <MapPin color="var(--primary)" style={{ marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--primary)' }}>Selected Address</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isGeocoding ? 'Detecting address...' : data.formattedAddress}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-footer">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onNext}
          disabled={!data.latitude || isGeocoding}
        >
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
