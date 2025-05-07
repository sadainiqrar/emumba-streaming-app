# Streaming App Frontend

A React-based frontend for the streaming application, similar to YouTube Live.

## Features

- User authentication with Google
- Live streaming functionality
- Real-time chat during streams
- Watch recorded streams
- Responsive design with Tailwind CSS

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Socket.io for real-time communication
- HLS.js for video streaming

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:5173.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── auth/         # Authentication related components
│   ├── chat/         # Chat related components
│   ├── layout/       # Layout components (Header, Sidebar, etc.)
│   └── stream/       # Stream related components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Application pages
├── services/         # API and socket services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Backend Integration

The frontend communicates with the backend through:

1. REST API for data operations
2. WebSockets for real-time communication (chat and streaming)
3. HLS for video streaming

## Development

To build the application for production:

```bash
npm run build
```

## License

MIT
