import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeSockets, disconnectSockets } from './services/socket';

// Pages
import HomePage from './pages/HomePage';
import StreamsPage from './pages/StreamsPage';
import StreamDetailPage from './pages/StreamDetailPage';
import CreateStreamPage from './pages/CreateStreamPage';
import StreamSetupPage from './pages/StreamSetupPage';
import AuthCallbackPage from './pages/AuthCallbackPage';

const AppRoutes = () => {
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initialize sockets when user is authenticated
      initializeSockets(token);

      return () => {
        // Disconnect sockets on unmount
        disconnectSockets();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/streams" element={<StreamsPage />} />
      <Route path="/streams/:status" element={<StreamsPage />} />
      <Route path="/stream/:id" element={<StreamDetailPage />} />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route
        path="/create-stream"
        element={isAuthenticated ? <CreateStreamPage /> : <Navigate to="/" />}
      />
      <Route
        path="/stream/:id/setup"
        element={isAuthenticated ? <StreamSetupPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
