import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface StreamPlayerProps {
  streamId: string;
  isLive: boolean;
}

const StreamPlayer = ({ streamId, isLive }: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    if (Hls.isSupported()) {
      const hls = new Hls();
      const streamUrl = isLive 
        ? `http://localhost:8080/live/${streamId}/index.m3u8` 
        : `/streams/${streamId}/index.m3u8`;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      const streamUrl = isLive 
        ? `http://localhost:8080/live/${streamId}/index.m3u8` 
        : `/streams/${streamId}/index.m3u8`;
      
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(error => {
          console.error('Error playing video:', error);
        });
      });
    }
  }, [streamId, isLive]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video 
        ref={videoRef} 
        className="w-full h-full" 
        controls 
        playsInline
      />
      {isLive && (
        <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm">
          LIVE
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;
