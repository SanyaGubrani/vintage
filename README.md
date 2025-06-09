# Vintage

[Vintage](https://vintagestorybook.com) is a social media app with a retro feel. Includes features like Google OAuth, real-time chat, AI integration, post interactions, bookmarks — all in one clean experience.

## Features

- **Authentication**
  Supports both traditional sign-up/login and Google OAuth.

- **User Profiles**
  Edit your profile information and manage your account.

- **Social Interaction**
  Follow/unfollow users to personalize your feed and connect with others.

- **Posts & Comments**
  Create, like/unlike, save, and comment on posts. Replies and interaction included.

- **Bookmarks**
  Save your favorite posts for later.

- **Live Chat**
  Real-time private messaging with Socket.IO.

- **AI Chat Bot**
  Gemini ai assistant with custom instructions.

- **Cloudinary Integration**
  Upload and manage media seamlessly.


## Getting Started

You can run the app locally or with Docker.

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Atlas or local)
- [Cloudinary](https://cloudinary.com/) account for media hosting
- Gemini API key from Google
- Google Cloud credentials for OAuth
- Docker (optional)


## Installation

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


## Run with Docker

Both `client/` and `server/` have Dockerfiles ready.

### Example:

```bash
# In the root folder:
docker compose up --build
```


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


