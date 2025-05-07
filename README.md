# Emumba Streaming App

<img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45" alt="Nx logo">

A live streaming platform similar to YouTube Live, built with NestJS, React, TypeScript, and Tailwind CSS.

## Features

- User authentication with Google
- Live streaming functionality
- Real-time chat during streams
- Watch recorded streams
- Responsive design with Tailwind CSS

## Tech Stack

### Backend
- NestJS
- TypeORM with SQLite
- Socket.io for real-time communication
- Bull for job processing
- Node Media Server for RTMP streaming
- Passport.js for authentication

### Frontend
- React
- TypeScript
- Tailwind CSS
- Socket.io client for real-time communication
- HLS.js for video playback

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker (for Redis)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/emumba-streaming-app.git
cd emumba-streaming-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment files to create your own:

```bash
# For backend
cp .env.example .env

# For frontend
cp frontend/.env.example frontend/.env
```

Then edit the `.env` file in the root directory with your own values:

```
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Redis Configuration (for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# Media Server Configuration
RTMP_PORT=1935
MEDIA_HTTP_PORT=8080

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

Replace `your_jwt_secret_key_here`, `your_google_client_id_here`, and `your_google_client_secret_here` with your actual values.

For production deployment, update the following environment variables:

1. In the backend `.env` file:
   - `ALLOWED_ORIGINS`: Add your production frontend domain
   - `FRONTEND_URL`: Set to your production frontend domain

2. In the frontend `.env.production` file:
   - `VITE_API_URL`: Set to your production backend domain, or leave empty if frontend and backend are on the same domain

### 4. Start Redis

Run the Redis container using Docker:

```bash
# On Linux/Mac
./start-redis.sh

# On Windows
start-redis.bat
```

### 5. Run the application

#### Start both backend and frontend

```bash
npm run start:all
```

#### Start only the backend

```bash
npm run start:backend
```

#### Start only the frontend

```bash
npm run start:frontend
```

### 6. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Media Server: http://localhost:8080

## Project Structure

```
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API and socket services
│   │   └── types/           # TypeScript type definitions
│   └── ...
├── src/                     # NestJS backend application
│   ├── app/                 # Main application module
│   ├── auth/                # Authentication module
│   ├── chat/                # Chat module
│   ├── mediaServer/         # Media server module
│   ├── stream/              # Stream module
│   └── user/                # User module
├── streams/                 # Directory for storing stream files
└── ...
```

## Development

### Building the application

```bash
npm run build:all
```

### Running tests

```bash
npm test
```

## License

MIT
