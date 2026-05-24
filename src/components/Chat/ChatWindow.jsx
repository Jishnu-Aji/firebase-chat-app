import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useTyping } from '../../hooks/useTyping';

const ChatWindow = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const { messages, loading, error } = useMessages(roomId);
  const { isTyping, setTyping } = useTyping(roomId, currentUser?.uid);

  // Auto scroll to bottom when messages change
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <div className="chat-loading">Loading messages...</div>;
  if (error) return <div className="chat-error">Error loading messages: {error.message}</div>;

  return (
    <div className="chat-window flex flex-col h-full">
      <MessageList messages={messages} currentUser={currentUser} />
      <div ref={bottomRef} />
      {isTyping && <TypingIndicator />}
      <MessageInput roomId={roomId} onTyping={setTyping} />
    </div>
  );
};

export default ChatWindow;
