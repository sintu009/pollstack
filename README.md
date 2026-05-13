Login Creds:
username : livewest@gmail.com
password : 9876987617

# PollStack

PollStack is a full-stack polling and survey application with a React + Vite frontend and a Node.js + Express backend.

## Tech Stack

- Backend
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JSON Web Tokens (JWT)
  - bcryptjs
  - WebSocket (`ws`)
  - dotenv
  - CORS
- Frontend
  - React
  - Vite
  - Redux Toolkit
  - Tailwind CSS
  - Google OAuth
  - Zod
  - React Icons

## Repository Structure

- `Backend/` - Express API server, MongoDB models, authentication, poll management, response tracking, templates, and WebSocket support.
- `Frontend/` - React application with admin and user experiences, Google auth integration, polls UI, analytics, and shared poll pages.

## Installation

### 1. Backend

```bash
cd Backend
npm install
```

Create a backend environment file from the example:

```bash
copy .env.example .env
```

Update `.env` with your MongoDB connection string and JWT secret.

Start backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd Frontend
npm install
```

Create a frontend environment file from the example:

```bash
copy .env.example .env
```

Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth client ID.

Start frontend:

```bash
npm run dev
```

## Environment Variables

### Backend (`Backend/.env`)

Required variables:

- `MONGO_URI` - MongoDB connection URI
- `JWT_SECRET` - Secret used to sign JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration duration (e.g. `7d`)
- `CLIENT_URL` - Frontend origin for CORS support (e.g. `http://localhost:5173`)
- `PORT` - Backend port (default: `5000`)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID for token verification
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret for backend verification

### Frontend (`Frontend/.env`)

Required variable:

- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID used by React Google OAuth provider

## API Overview

### Health Check

- `GET /api/health`

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google OAuth token
- `GET /api/auth/me` - Get current authenticated user

### Polls

- `POST /api/polls` - Create a new poll
- `GET /api/polls/my` - Get polls created by the current user
- `GET /api/polls/link/:link` - Get poll details by share link
- `PATCH /api/polls/:id/publish` - Publish a poll
- `PATCH /api/polls/:id/toggle` - Toggle poll active state

### Responses

- `POST /api/responses` - Submit poll responses
- `POST /api/responses/progress` - Send response progress updates
- `GET /api/responses/check/:pollId` - Check poll response status
- `GET /api/responses/analytics/:pollId` - Fetch poll analytics
- `GET /api/responses/results/:link` - Get public poll results by link

### Templates

- `GET /api/templates` - List templates
- `GET /api/templates/:id` - Get a single template
- `POST /api/templates` - Create a template
- `DELETE /api/templates/:id` - Delete a template

## WebSocket

- WebSocket endpoint: `ws://localhost:5000/ws`

## Notes

- By default, the frontend expects the backend API at `http://localhost:5000/api`.
- Use `.env.example` files to create actual `.env` files in `Backend/` and `Frontend/`.
- Ensure MongoDB is running and accessible from `MONGO_URI`.
