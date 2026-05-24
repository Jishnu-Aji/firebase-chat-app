function TypingIndicator({ typingUsers = [] }) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="typing-indicator">
      {typingUsers.join(", ")} typing...
    </div>
  );
}

export default TypingIndicator;
