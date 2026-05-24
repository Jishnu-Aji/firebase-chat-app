import RoomItem from './RoomItem';
import LoadingSpinner from '../UI/LoadingSpinner';
import useRooms from '../../hooks/useRooms';

const DEFAULT_ROOMS = [
  { id: 'general', name: 'General', description: 'Open discussion for everyone', emoji: '💬' },
  { id: 'random', name: 'Random', description: 'Random thoughts & fun', emoji: '🎲' },
  { id: 'tech', name: 'Tech Talk', description: 'Programming & technology', emoji: '💻' },
];

const RoomList = ({ selectedRoomId, onSelectRoom, search }) => {
  const { rooms, loading } = useRooms();

  if (loading) {
    return (
      <div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="room-item-skeleton">
            <div className="skeleton skeleton-icon" />
            <div>
              <div className="skeleton skeleton-line-short" />
              <div className="skeleton skeleton-line-long" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Merge default rooms + Firestore rooms (deduplicated by name)
  const firestoreNames = new Set(rooms.map((r) => r.name.toLowerCase()));
  const defaults = DEFAULT_ROOMS.filter(
    (d) => !firestoreNames.has(d.name.toLowerCase())
  );
  const allRooms = [...defaults, ...rooms];

  const filtered = search
    ? allRooms.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase())
      )
    : allRooms;

  if (filtered.length === 0) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        No rooms found
      </div>
    );
  }

  return (
    <nav aria-label="Room list">
      {filtered.map((room) => (
        <RoomItem
          key={room.id}
          room={room}
          isActive={room.id === selectedRoomId}
          onClick={() => onSelectRoom(room)}
        />
      ))}
    </nav>
  );
};

export default RoomList;
