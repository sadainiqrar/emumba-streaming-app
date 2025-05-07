import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();

  const processAuthCallback = useCallback(() => {
    // Get token and user info from URL fragment
    const hash = window.location.hash.substring(1);
    console.log('URL hash:', hash); // Debug log

    if (!hash) {
      console.error('No URL fragment found');
      alert('Authentication error: No URL fragment found. Please try again.');
      navigate('/');
      return;
    }

    const params = new URLSearchParams(hash);
    console.log('URL params:', Object.fromEntries(params.entries())); // Debug log

    const token = params.get('token');
    const userString = params.get('user');

    // Log the token and userString for debugging
    console.log('Token present:', !!token);
    console.log('UserString present:', !!userString);

    if (token && userString) {
      try {
        console.log('Attempting to parse user data...');
        const user = JSON.parse(decodeURIComponent(userString));
        console.log('User data parsed successfully:', user);

        // Make sure we're using the correct token from the user object
        const actualToken = user.accessToken || token;

        // Log for debugging
        console.log('Auth callback received token:', actualToken);
        console.log('Auth callback received user:', user);

        // Validate token format (should be a JWT token)
        if (!actualToken || !actualToken.match(/^[\w-]*\.[\w-]*\.[\w-]*$/)) {
          console.error('Invalid token format:', actualToken);
          alert('Authentication error: Invalid token format. Please try again.');
          navigate('/');
          return;
        }

        // Store in localStorage
        localStorage.setItem('token', actualToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Update auth context
        setUserAndToken(user, actualToken);

        // Test the token with a simple API call
        fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${actualToken}`
          }
        })
          .then(response => {
            if (response.ok) {
              console.log('Token validation successful');
            } else {
              return response.text().then(text => {
                console.error('Token validation failed:', text);
                // Continue anyway, the interceptor will handle redirects if needed
              });
            }
          })
          .catch(apiError => {
            console.error('Error validating token:', apiError);
            // Continue anyway, the interceptor will handle redirects if needed
          });

        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error parsing user data:', error);
        alert('Authentication error: Could not parse user data. Please try again.');
        navigate('/');
      }
    } else {
      console.error('Missing token or user data in URL fragment');
      alert('Authentication error: Missing token or user data. Please try again.');
      navigate('/');
    }
  }, [navigate, setUserAndToken]);

  useEffect(() => {
    console.log('AuthCallbackPage mounted');
    console.log('Current URL:', window.location.href);
    processAuthCallback();
  }, [processAuthCallback]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Successful</h1>
        <p className="text-gray-600">Redirecting to the application...</p>
        <div className="mt-4">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
