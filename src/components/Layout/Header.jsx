import { Sun, Moon, MessageCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ onMenuClick, roomName }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button
          id="sidebar-menu-btn"
          className="chat-header-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <MessageCircle size={18} />
        </button>

        {roomName ? (
          <>
            <div className="chat-header-room-icon">💬</div>
            <div className="chat-header-info">
              <div className="chat-header-name">{roomName}</div>
              <div className="chat-header-desc">Real-time chat room</div>
            </div>
          </>
        ) : (
          <div className="chat-header-name" style={{ fontSize: '1rem', fontWeight: 700 }}>
            ChatSphere
          </div>
        )}
      </div>

      <div className="chat-header-right">
        <button
          id="theme-toggle-btn"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
