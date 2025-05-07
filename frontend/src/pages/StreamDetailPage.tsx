import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import StreamPlayer from '../components/stream/StreamPlayer';
import ChatBox from '../components/chat/ChatBox';
import { streamService } from '../services/api';
import { Stream } from '../types';

const StreamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [stream, setStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStream = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await streamService.getStreamById(id);
        setStream(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stream:', err);
        setError('Failed to load stream. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (error || !stream) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Stream not found'}</p>
        </div>
      </Layout>
    );
  }

  const isLive = stream.status === 'active';
  const formattedDate = new Date(stream.createdAt).toLocaleDateString();
  const formattedTime = new Date(stream.createdAt).toLocaleTimeString();

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <StreamPlayer streamId={stream.id} isLive={isLive} />
          
          <div>
            <h1 className="text-2xl font-bold">{stream.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              {isLive ? (
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">LIVE</span>
              ) : (
                <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">RECORDED</span>
              )}
              <span className="text-gray-600">
                {isLive ? 'Started' : 'Streamed'} on {formattedDate} at {formattedTime}
              </span>
            </div>
          </div>
        </div>
        
        <div className="h-[600px]">
          <ChatBox streamId={stream.id} />
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetailPage;
