# PostCraft — Social Media Content Manager

AI-powered social media post generator for Facebook, Instagram & WhatsApp.

---

## Project Structure

```
postcraft/
├── public/
│   └── index.html               # HTML entry point
├── src/
│   ├── index.js                 # React DOM entry
│   ├── App.jsx                  # App shell + router
│   │
│   ├── store/
│   │   ├── storage.js           # window.storage wrapper + utils (uid, hashPass)
│   │   ├── authStore.js         # User auth CRUD (login, register, session)
│   │   └── postStore.js         # Posts CRUD
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # useAuth hook + AuthProvider
│   │   └── PostsContext.jsx     # usePosts hook + PostsProvider
│   │
│   ├── styles/
│   │   └── theme.js             # Color tokens, global CSS, shared metadata
│   │
│   ├── components/              # Reusable UI primitives
│   │   ├── Avatar.jsx
│   │   ├── Badge.jsx
│   │   ├── Btn.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Spinner.jsx
│   │   ├── StatCard.jsx
│   │   └── Toast.jsx
│   │
│   └── pages/
│       ├── LoginPage.jsx        # Sign-in + forgot password
│       ├── DashboardPage.jsx    # Stats overview + recent posts
│       ├── CreatePostPage.jsx   # AI post generator
│       ├── PostHistoryPage.jsx  # Browse, filter, view, delete posts
│       ├── AnalyticsPage.jsx    # Charts: daily, by type/platform/tone
│       └── SettingsPage.jsx     # Profile, password, user management
│
└── package.json
```

---

## Prerequisites

- **Node.js** v16 or higher → https://nodejs.org
- **npm** (comes with Node.js)

Check your versions:
```bash
node -v   # should be 16+
npm -v
```

---

## Setup & Run

### 1. Install dependencies
```bash
cd postcraft
npm install
```

### 2. Start development server
```bash
npm start
```

This opens **http://localhost:3000** in your browser automatically.

### 3. Default login credentials
```
Email:    admin@postcraft.io
Password: Admin@123
```
---

## Build for Production

```bash
npm run build
```

Output goes to the `build/` folder. You can deploy it to any static host (Netlify, Vercel, GitHub Pages, etc.).

---
