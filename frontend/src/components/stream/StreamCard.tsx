import { Link } from 'react-router-dom';
import { Stream } from '../../types';

interface StreamCardProps {
  stream: Stream;
}

const StreamCard = ({ stream }: StreamCardProps) => {
  const isLive = stream.status === 'active';
  const formattedDate = new Date(stream.createdAt).toLocaleDateString();
  
  return (
    <Link to={`/stream/${stream.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-gray-200">
          {/* Thumbnail placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-400" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          {isLive && (
            <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
              LIVE
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{stream.title}</h3>
          <div className="mt-2 text-sm text-gray-600">
            {isLive ? 'Started' : 'Streamed'} on {formattedDate}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StreamCard;
