import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Package, HandHeart, Clock } from 'lucide-react';

export function MapView({ items, myClaims, onMessageChange, requestMessage, onRequest }) {
  const defaultCenter = [20.5937, 78.9629]; // Default to India

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      <MapContainer 
        center={items.length > 0 && items[0].latitude ? [items[0].latitude, items[0].longitude] : defaultCenter} 
        zoom={items.length > 0 && items[0].latitude ? 12 : 5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {items.map(item => {
          if (!item.latitude || !item.longitude) return null;
          
          const alreadyRequested = myClaims.some(c => c.itemId === item.id);
          
          return (
            <Marker key={item.id} position={[item.latitude, item.longitude]}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Package size={16} /> {item.title}
                  </h3>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{item.category}</span>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><strong>Qty:</strong> {item.quantity}</p>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>{item.description}</p>
                  
                  {!alreadyRequested ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Reason for request..." 
                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                        value={requestMessage[item.id] || ''}
                        onChange={(e) => onMessageChange(item.id, e.target.value)}
                      />
                      <button 
                        onClick={() => onRequest(item.id)} 
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem' }}
                      >
                        <HandHeart size={14} /> Request
                      </button>
                    </div>
                  ) : (
                    <div className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0.25rem' }}>
                      <Clock size={12} /> Requested
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
