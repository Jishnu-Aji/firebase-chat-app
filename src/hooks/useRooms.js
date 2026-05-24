import { useState, useEffect } from 'react';
import { subscribeToRooms } from '../firebase/firestore';

/**
 * Subscribes to all chat rooms in real time.
 */
const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToRooms((roomList) => {
      setRooms(roomList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { rooms, loading, error };
};

export default useRooms;
