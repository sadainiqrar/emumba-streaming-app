import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-600" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <span className="text-xl font-bold">StreamApp</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/streams" className="text-gray-700 hover:text-gray-900">Streams</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/create-stream" className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
                Create Stream
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.name.charAt(0)}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {user?.name}
                  </div>
                  <hr />
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
