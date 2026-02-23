# 🤖 AI-Powered Support Assistant

This is a full-stack AI-powered Support Assistant built using React, Node.js, and SQLite.

The application allows users to chat with an AI assistant that answers questions based only on the provided product documentation.

---

## 🧠 Tech Stack Used

### Frontend:
- React.js (Vite)

### Backend:
- Node.js
- Express.js

### Database:
- SQLite

### AI Logic:
- Document-based answering using docs.json

---

## 🎯 Features

- Chat interface built using React
- Session-based conversation using sessionId
- Stores conversation history in SQLite
- Fetch previous chats based on session
- Document-based answering system
- Strict no-hallucination policy
- Rate limiting per IP
- New Chat button to start fresh session
- Timestamp for each message

---

## 📁 Project Structure


AI-Powered-Assistant/
│
├── frontend/
│ └── React Chat UI
│
├── backend/
│ ├── db/
│ │ └── database.sqlite
│ ├── routes/
│ │ ├── chat.js
│ │ ├── sessions.js
│ │ └── conversations.js
│ ├── docs.json
│ ├── db.js
│ ├── llm.js
│ ├── server.js
│ └── rateLimiter.js
│
└── README.md  


---

## 🗄️ Database Schema

### Sessions Table

| Column      | Type     |
|------------|----------|
| id         | TEXT     |
| created_at | DATETIME |
| updated_at | DATETIME |

---

### Messages Table

| Column      | Type     |
|------------|----------|
| id         | INTEGER  |
| session_id | TEXT     |
| role       | TEXT     |
| content    | TEXT     |
| created_at | DATETIME |

---

## 📄 Documentation File

The assistant answers questions only from `docs.json`.

Example:

```json
[
  {
    "title": "Reset Password",
    "content": "Users can reset password from Settings > Security."
  }
]
