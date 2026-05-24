# Multi‑Room Chat Application

## Overview
A modern, responsive React app powered by Firebase (Auth + Firestore) that lets users sign‑in with Google, create or join chat rooms, and exchange messages in real‑time.

## Features
- Google sign‑in / sign‑out
- Create, list & join multiple chat rooms
- Real‑time messaging with usernames, avatars, timestamps
- Dark‑mode toggle (uses the ThemeContext)
- Typing indicator, online/offline status, emoji picker (optional extensions)
- Auto‑scroll, responsive layout (sidebar + chat view)

## Getting Started
1. **Clone / copy the repo** (already in `c:\Users\user\Documents\mulearn task\chat-room`).
2. **Create a Firebase project** and enable Authentication (Google) and Firestore.
3. Copy `.env.example` to `.env.local` and fill in the values from your Firebase console.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
   The app will be reachable at `http://localhost:5173`.

## Deployment
- **Firebase Hosting**
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init hosting   # select the `dist` folder after building
  npm run build
  firebase deploy
  ```
- **Vercel** – import the repo, set the environment variables from `.env.local`, and Vercel will run `npm run build` automatically.

## Folder Structure
```
src/
├─ assets/               # images, icons
├─ components/           # UI, layout & chat components
│   ├─ Auth/            # Login & logout UI
│   ├─ Chat/            # ChatWindow, MessageList, MessageInput
│   ├─ Layout/          # Sidebar, Header
│   └─ UI/              # generic UI pieces (Modal, Spinner)
├─ contexts/            # ThemeContext (light/dark)
├─ firebase/            # config.js & firestore.js
├─ hooks/                # useRooms, useMessages, useTyping, useOnlineStatus
├─ styles/              # CSS modules (global, auth, chat, components)
├─ App.jsx               # root component with routing
└─ main.jsx              # ReactDOM render
```

## Security Rules (Firestore)
See `firestore.rules`. They restrict reads/writes to authenticated users and enforce that a user can only write messages to rooms they are a member of.

## Contributing
Feel free to open PRs for bug‑fixes, UI tweaks, or new features (e.g., image sharing, private DM).

---
*All UI designed with a dark‑mode‑first glassmorphism aesthetic and smooth micro‑animations.*
