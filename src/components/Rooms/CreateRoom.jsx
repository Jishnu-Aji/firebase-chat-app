import { useState } from 'react';
import { Hash } from 'lucide-react';
import Modal from '../UI/Modal';
import { createRoom } from '../../firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const ROOM_EMOJIS = ['💬', '🎲', '💻', '🎮', '🎵', '🎬', '⚽', '🍕', '✈️', '🎨', '📚', '🔬'];

const CreateRoom = ({ isOpen, onClose, onCreated }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('💬');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room name is required.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Room name must be at least 2 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomId = await createRoom(name, description, currentUser);
      const newRoom = {
        id: roomId,
        name: name.trim(),
        description: description.trim(),
        emoji,
      };
      onCreated(newRoom);
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setEmoji('💬');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a Room"
      titleIcon={<Hash size={16} />}
      footer={
        <>
          <button className="btn btn-ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button
            id="create-room-submit-btn"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" />
                Creating…
              </>
            ) : (
              'Create Room'
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} id="create-room-form">
        {/* Room Icon */}
        <div className="form-group">
          <label className="form-label">Room Icon</label>
          <div className="emoji-row">
            {ROOM_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className={`emoji-option ${emoji === e ? 'selected' : ''}`}
                onClick={() => setEmoji(e)}
                aria-label={`Choose ${e} emoji`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Room Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="room-name-input">
            Room Name <span style={{ color: 'var(--color-error)' }}>*</span>
          </label>
          <input
            id="room-name-input"
            type="text"
            className={`form-input ${error && !name.trim() ? 'error' : ''}`}
            placeholder="e.g. Design Feedback"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            maxLength={50}
            autoFocus
          />
          <span className="form-hint">{50 - name.length} characters remaining</span>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="room-desc-input">
            Description <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
          </label>
          <input
            id="room-desc-input"
            type="text"
            className="form-input"
            placeholder="What's this room about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
};

export default CreateRoom;
