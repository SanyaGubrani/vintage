# Vintage A Retro Social Media Experience

Vintage is a social media application that brings back old vibes. Packed with modern features like Google OAuth, real-time chat, AI integration, post interactions, bookmarks, and offers a fresh experience wrapped in retro aesthetics.

---

## Live Preview

- Live Preview: [https://vintagestorybook.com](https://vintagestorybook.com)

---

## Features

- **Authentication**
  Supports both traditional sign-up/login and Google OAuth.

- **Posts & Comments**
  Create, like/unlike, save, and comment on posts. Replies and interaction included.

- **Bookmarks**
  Save your favorite posts for later.

- **Live Chat**
  Real-time private messaging with Socket.IO.

- **AI Chat Bot**
  Gemini ai smart assistant with custom instructions for safe usage.

- **Cloudinary Integration**
  Upload and manage media seamlessly.

---

## Getting Started

You can run the app locally or with Docker.

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas or local)
- [Cloudinary](https://cloudinary.com/) account for media hosting
- Gemini API key from Google
- Google Cloud credentials for OAuth
- Docker (optional)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SanyaGubrani/vintage.git
cd vintage-social-app
```

### 2. Set Environment Variables

Fill in the `.env` files based on the `.env.example` files provided in both `client/` and `server/`.

#### `client/.env` Example:

```env
VITE_API_URL=http://localhost:4080
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_SOCKET_BASE_URL=http://localhost:4080
```

#### `server/.env` Example:

```env
PORT=4080
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=a_very_strong_and_random_secret_key
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key
CALLBACK_URL_BASE=http://localhost:4080/api/v1/google/callback

```

### 3. Install Dependencies

```bash
# In the root folder:
cd server && npm install
cd ../client && npm install
```

### 4. Start Development Servers

```bash
# In separate terminals:
cd server
npm run dev

cd client
npm run dev
```

App will be available at:
Frontend: `http://localhost:5173` (default port)
Backend: `http://localhost:4080`

---

## Run with Docker

Both `client/` and `server/` have Dockerfiles ready.

### Example:

```bash
# In the root folder:
docker compose up --build
```

---

## Folder Structure

```
vintage-social-app/
│
├── client/           # Frontend (Vite + React)
│   ├── .env.example
│   ├── Dockerfile
│   └── ...
│
├── server/           # Backend (Node.js + Express)
│   ├── .env.example
│   ├── Dockerfile
│   └── ...
│
└── README.md
```

## AI Usage

The app integrates Gemini AI to assist users with helpful, moderated conversations. Gemini is configured with secure instructions and API integration.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

MIT License © Vintage


