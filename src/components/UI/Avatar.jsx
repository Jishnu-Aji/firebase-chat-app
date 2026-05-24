import { useState } from 'react';

const COLORS = [
  'linear-gradient(135deg, #6c63ff, #a78bfa)',
  'linear-gradient(135deg, #f97316, #fb923c)',
  'linear-gradient(135deg, #10b981, #34d399)',
  'linear-gradient(135deg, #3b82f6, #60a5fa)',
  'linear-gradient(135deg, #ec4899, #f472b6)',
  'linear-gradient(135deg, #f59e0b, #fbbf24)',
];

const getColorForName = (name = '') => {
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
};

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const Avatar = ({ user, size = 'md', showStatus = false, isOnline = false }) => {
  const [imgError, setImgError] = useState(false);
  const sizeClass = `avatar-${size}`;
  const gradient = getColorForName(user?.displayName || '');
  const initials = getInitials(user?.displayName || '?');

  return (
    <div className={`avatar ${sizeClass}`} title={user?.displayName}>
      {user?.photoURL && !imgError ? (
        <img
          src={user.photoURL}
          alt={user.displayName}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="avatar-fallback" style={{ background: gradient }}>
          {initials}
        </div>
      )}
      {showStatus && (
        <span className={`avatar-status ${isOnline ? 'online' : 'offline'}`} />
      )}
    </div>
  );
};

export default Avatar;
