import { useState, useEffect } from 'react';
import { subscribeToMessages } from '../firebase/firestore';

/**
 * Subscribes to real-time messages in a Firestore room.
 * @param {string|null} roomId - The room ID to listen to
 */
const useMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMessages(roomId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { messages, loading, error };
};
export { useMessages };
export default useMessages;


