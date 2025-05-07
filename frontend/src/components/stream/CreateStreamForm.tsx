import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { streamService } from '../../services/api';

const CreateStreamForm = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a stream title');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await streamService.createStream(title);
      const streamId = response.data.id;
      
      // Navigate to the stream setup page
      navigate(`/stream/${streamId}/setup`);
    } catch (err) {
      console.error('Error creating stream:', err);
      setError('Failed to create stream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Stream</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Stream Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a title for your stream"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className={`w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Stream'}
        </button>
      </form>
    </div>
  );
};

export default CreateStreamForm;
