import { useEffect, useState, useRef } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import {
  auth,
  db,
  signInWithGoogle,
  logoutUser,
} from "./firebase/config";

function App() {
  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll to latest message
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h1>Firebase Chat App </h1>

        <button
          onClick={signInWithGoogle}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Sign In With Google
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Realtime Chat </h2>

        <button
          onClick={logoutUser}
          style={{
            padding: "10px",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "65vh",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.name === user.displayName;

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isMe ? "#2563eb" : "#1e293b",
                  padding: "12px",
                  borderRadius: "16px",
                  maxWidth: "320px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <img
                  src={
                    msg.photoURL ||
                    "https://ui-avatars.com/api/?name=User"
                  }
                  alt="avatar"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=User";
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <strong
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {msg.name}
                  </strong>

                  <p
                    style={{
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </p>

                  <small
                    style={{
                      opacity: 0.7,
                      fontSize: "11px",
                    }}
                  >
                    {msg.createdAt?.seconds
                      ? new Date(
                          msg.createdAt.seconds * 1000
                        ).toLocaleTimeString()
                      : ""}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        <div ref={messagesEndRef} />
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            outline: "none",
            fontSize: "16px",
            border: "none",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Send
        </button>
              </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            opacity: 0.6,
            fontSize: "14px",
          }}
        >
          Built with React & Firebase
        </p>
    </div>
  );
}

export default App;
