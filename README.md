# Realtime Firebase Chat App

A modern realtime chat application built with React, Firebase Authentication, and Cloud Firestore. Users can sign in using Google Authentication and exchange realtime messages instantly.

---

# Features

- Google Authentication
- Realtime Messaging
- Cloud Firestore Integration
- Firebase Hosting
- Responsive User Interface
- User Avatars
- Message Timestamps
- Live Data Synchronization
- Protected Firestore Rules

---

# Tech Stack

- React.js
- Vite
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- CSS3

---

# Project Structure

```bash
chat-room/
│
├── public/
├── src/
│   ├── firebase/
│   │   └── config.js
│   │
│   ├── components/
│   ├── hooks/
│   ├── contexts/
│   ├── styles/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.local
├── firebase.json
├── firestore.rules
├── package.json
└── vite.config.js
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/firebase-chat-app.git
```

## Navigate To Project

```bash
cd firebase-chat-app
```

## Install Dependencies

```bash
npm install
```

---

# Firebase Setup

## Step 1 — Create Firebase Project

Go to:

https://console.firebase.google.com/

Create a new Firebase project.

---

## Step 2 — Register Web App

Inside Firebase:
- Click Add App
- Select Web
- Register your application

Firebase will provide:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## Step 3 — Enable Authentication

Navigate to:

```text
Authentication → Sign-in Method
```

Enable:
- Google Provider

---

## Step 4 — Create Firestore Database

Navigate to:

```text
Firestore Database
```

Create database in:
- Test Mode

---

## Step 5 — Configure Environment Variables

Create `.env.local` in root folder:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

# Firebase Configuration

Create:

```text
src/firebase/config.js
```

```javascript
import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, provider);
};

export const logoutUser = async () => {
  return signOut(auth);
};
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Firestore Rules

Replace Firestore rules with:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Publish rules.

---

# Build Project

```bash
npm run build
```

---

# Firebase Hosting Deployment

## Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Login To Firebase

```bash
firebase login
```

## Initialize Firebase Hosting

```bash
firebase init
```

Select:
- Hosting

Choose:
- Use existing project
- Select Firebase project

Public directory:
```text
dist
```

Configure as SPA:
```text
Yes
```

Automatic GitHub deploy:
```text
No
```

---

# Deploy Application

```bash
firebase deploy
```

Firebase will generate a live URL:

```text
https://your-project.web.app
```

---

# GitHub Push Commands

```bash
git init
git add .
git commit -m "Realtime Firebase Chat App"
git branch -M main
git remote add origin https://github.com/your-username/firebase-chat-app.git
git push -u origin main
```

---

# Future Improvements

- Multiple Chat Rooms
- Typing Indicators
- Online Users
- Emoji Picker
- Private Messaging
- Image Uploads
- Dark Mode
- Push Notifications

---

# Live Demo

```text
https://your-project.web.app
```

---

# Author

Your Name

GitHub:
https://github.com/your-username

---

# License

This project is licensed under the MIT License.
