import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  where,
  increment,
} from 'firebase/firestore';
import { db } from './config';

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Creates or updates a user document in Firestore on login.
 */
export const upsertUser = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const data = {
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
    lastSeen: serverTimestamp(),
    isOnline: true,
  };

  if (!snap.exists()) {
    await setDoc(userRef, { ...data, createdAt: serverTimestamp() });
  } else {
    await updateDoc(userRef, data);
  }
};

/**
 * Sets user as offline when they leave.
 */
export const setUserOffline = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    isOnline: false,
    lastSeen: serverTimestamp(),
  });
};

// ─── Rooms ─────────────────────────────────────────────────────────────────────

/**
 * Subscribes to all chat rooms ordered by creation date.
 * Returns an unsubscribe function.
 */
export const subscribeToRooms = (callback) => {
  const q = query(collection(db, 'rooms'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(rooms);
  });
};

/**
 * Creates a new chat room.
 */
export const createRoom = async (name, description, user) => {
  // Check if room name already exists
  const q = query(collection(db, 'rooms'), where('name', '==', name.trim()));
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error('A room with this name already exists.');
  }

  const roomRef = await addDoc(collection(db, 'rooms'), {
    name: name.trim(),
    description: description.trim(),
    createdBy: user.uid,
    createdByName: user.displayName,
    createdAt: serverTimestamp(),
    memberCount: 1,
  });

  return roomRef.id;
};

// ─── Messages ──────────────────────────────────────────────────────────────────

/**
 * Subscribes to messages in a room (latest 100).
 * Returns an unsubscribe function.
 */
export const subscribeToMessages = (roomId, callback) => {
  const q = query(
    collection(db, 'rooms', roomId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

/**
 * Sends a message to a room.
 */
export const sendMessage = async (roomId, text, user) => {
  await addDoc(collection(db, 'rooms', roomId, 'messages'), {
    text: text.trim(),
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
  });
};

/**
 * Deletes a message (only allowed for the sender).
 */
export const deleteMessage = async (roomId, messageId) => {
  await deleteDoc(doc(db, 'rooms', roomId, 'messages', messageId));
};

// ─── Typing Indicators ─────────────────────────────────────────────────────────

/**
 * Sets typing status for a user in a room.
 */
export const setTyping = async (roomId, user, isTyping) => {
  const typingRef = doc(db, 'typing', roomId, 'users', user.uid);
  if (isTyping) {
    await setDoc(typingRef, {
      displayName: user.displayName,
      timestamp: serverTimestamp(),
    });
  } else {
    await deleteDoc(typingRef);
  }
};

/**
 * Subscribes to typing users in a room.
 * Returns an unsubscribe function.
 */
export const subscribeToTyping = (roomId, currentUid, callback) => {
  const q = collection(db, 'typing', roomId, 'users');
  return onSnapshot(q, (snapshot) => {
    const typers = snapshot.docs
      .filter((doc) => doc.id !== currentUid)
      .map((doc) => doc.data().displayName);
    callback(typers);
  });
};
