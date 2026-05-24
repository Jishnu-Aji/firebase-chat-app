import { useState, useEffect, useRef, useCallback } from 'react';
import { setTyping, subscribeToTyping } from '../firebase/firestore';

const TYPING_TIMEOUT = 3000; // 3 seconds

/**
 * Manages typing indicator state for a room.
 * @param {string|null} roomId
 * @param {object} user - Current Firebase user
 */
const useTyping = (roomId, user) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Subscribe to who is typing
  useEffect(() => {
    if (!roomId || !user) return;

    const unsubscribe = subscribeToTyping(roomId, user.uid, (typers) => {
      setTypingUsers(typers);
    });

    return () => {
      unsubscribe();
      // Clear own typing status on unmount
      if (isTypingRef.current) {
        setTyping(roomId, user, false);
        isTypingRef.current = false;
      }
    };
  }, [roomId, user]);

  // Call this when user types a character
  const handleTyping = useCallback(() => {
    if (!roomId || !user) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      setTyping(roomId, user, true);
    }

    // Reset the timeout on each keystroke
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      setTyping(roomId, user, false);
    }, TYPING_TIMEOUT);
  }, [roomId, user]);

  // Call this when user sends a message
  const stopTyping = useCallback(() => {
    if (!roomId || !user) return;
    clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      setTyping(roomId, user, false);
    }
  }, [roomId, user]);

  return { typingUsers, handleTyping, stopTyping };
};

export default useTyping;
