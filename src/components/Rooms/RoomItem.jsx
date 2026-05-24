const ROOM_EMOJIS = {
  general: '💬',
  random: '🎲',
  tech: '💻',
  gaming: '🎮',
  music: '🎵',
  movies: '🎬',
  sports: '⚽',
  food: '🍕',
  travel: '✈️',
  design: '🎨',
};

const getEmoji = (room) => {
  if (room.emoji) return room.emoji;
  const key = room.name?.toLowerCase().split(' ')[0];
  return ROOM_EMOJIS[key] || '💬';
};

const RoomItem = ({ room, isActive, onClick }) => {
  return (
    <button
      id={`room-${room.id}`}
      className={`room-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={`${room.name} room`}
      role="menuitem"
    >
      <div className="room-item-icon">{getEmoji(room)}</div>
      <div className="room-item-info">
        <div className="room-item-name">{room.name}</div>
        {room.description && (
          <div className="room-item-desc">{room.description}</div>
        )}
      </div>
      {isActive && <div className="room-item-active-dot" aria-hidden="true" />}
    </button>
  );
};

export default RoomItem;
