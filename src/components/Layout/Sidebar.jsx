import { useState } from 'react';
import { LogOut, Plus, MessageCircle, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../UI/Avatar';
import RoomList from '../Rooms/RoomList';
import CreateRoom from '../Rooms/CreateRoom';
import '../../styles/sidebar.css';

const Sidebar = ({ selectedRoom, onSelectRoom, isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleRoomSelect = (room) => {
    onSelectRoom(room);
    onClose(); // close sidebar on mobile after selecting
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Chat rooms sidebar">
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <MessageCircle size={18} />
            </div>
            <span className="sidebar-brand-name">ChatSphere</span>

            {/* Theme toggle inside sidebar for desktop */}
            <button
              id="sidebar-theme-btn"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ marginLeft: 'auto' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Search */}
          <div className="sidebar-search">
            <Search size={14} className="sidebar-search-icon" />
            <input
              id="room-search-input"
              type="text"
              className="sidebar-search-input"
              placeholder="Search rooms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search rooms"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-title">Rooms</span>
            <button
              id="create-room-btn"
              className="sidebar-create-btn"
              onClick={() => setShowCreate(true)}
              title="Create room"
              aria-label="Create new room"
            >
              <Plus size={14} />
            </button>
          </div>

          <RoomList
            selectedRoomId={selectedRoom?.id}
            onSelectRoom={handleRoomSelect}
            search={search}
          />
        </div>

        {/* User Profile */}
        <div className="sidebar-user">
          <Avatar user={currentUser} size="md" showStatus isOnline />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.displayName}</div>
            <div className="sidebar-user-status">Online</div>
          </div>
          <button
            id="logout-btn"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Create Room Modal */}
      <CreateRoom
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleRoomSelect}
      />
    </>
  );
};

export default Sidebar;
