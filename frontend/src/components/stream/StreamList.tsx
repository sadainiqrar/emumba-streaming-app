import { useEffect, useState } from 'react';
import { Stream } from '../../types';
import { streamService } from '../../services/api';
import StreamCard from './StreamCard';

interface StreamListProps {
  status?: 'active' | 'completed';
}

const StreamList = ({ status }: StreamListProps) => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = status 
          ? await streamService.getStreamsByStatus(status)
          : await streamService.getAllStreams();
        
        setStreams(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching streams:', err);
        setError('Failed to load streams. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-8 rounded text-center">
        <p className="text-lg">No streams found</p>
        <p className="text-sm mt-2">
          {status === 'active' 
            ? 'There are no live streams at the moment.' 
            : 'No past streams are available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};

export default StreamList;
