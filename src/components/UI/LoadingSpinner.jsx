import { MessageCircle } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading...', fullScreen = true, size = '' }) => {
  if (!fullScreen) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className={`spinner ${size ? `spinner-${size}` : ''}`} />
      </div>
    );
  }

  return (
    <div className="spinner-overlay">
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: 64,
            height: 64,
            background: 'var(--brand-gradient)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: 'var(--shadow-glow)',
            animation: 'pulse 2s ease infinite',
          }}
        >
          <MessageCircle size={28} color="white" />
        </div>
      </div>
      <div className="spinner" />
      <p className="spinner-label">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
