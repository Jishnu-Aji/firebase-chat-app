function MessageList({ messages = [] }) {
  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.user}</strong>

            <p>{msg.text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageList;
