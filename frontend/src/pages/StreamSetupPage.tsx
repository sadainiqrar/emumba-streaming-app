import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { streamService } from '../services/api';
import { getStreamSocket } from '../services/socket';
import { Stream } from '../types';

const StreamSetupPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stream, setStream] = useState<Stream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchStream = async () => {
      if (!id) return;
      
      try {
        const response = await streamService.getStreamById(id);
        setStream(response.data);
        
        if (response.data.status !== 'active') {
          setError('This stream is not active.');
        }
      } catch (err) {
        console.error('Error fetching stream:', err);
        setError('Failed to load stream. Please try again later.');
      }
    };

    fetchStream();
  }, [id, isAuthenticated, navigate]);

  const startCamera = async () => {
    try {
      const constraints = {
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = mediaStream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera and microphone. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
      if (isStreaming) {
        stopStreaming();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startStreaming = () => {
    if (!mediaStreamRef.current || !id) return;
    
    try {
      const streamSocket = getStreamSocket();
      
      // Notify server that we're starting a stream
      streamSocket.emit('startStream', id);
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'video/webm;codecs=vp9',
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Send video chunk to server
          streamSocket.emit('videoChunk', {
            streamId: id,
            chunk: event.data,
          });
        }
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsStreaming(true);
      
      // Navigate to the stream page
      navigate(`/stream/${id}`);
    } catch (err) {
      console.error('Error starting stream:', err);
      setError('Failed to start streaming. Please try again.');
    }
  };

  const stopStreaming = () => {
    if (!mediaRecorderRef.current || !id) return;
    
    try {
      // Stop recording
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      
      // Notify server that we're ending the stream
      const streamSocket = getStreamSocket();
      streamSocket.emit('endStream', id);
      
      setIsStreaming(false);
    } catch (err) {
      console.error('Error stopping stream:', err);
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!stream) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Stream Setup</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{stream.title}</h2>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <video
              ref={videoRef}
              className="w-full h-full"
              autoPlay
              playsInline
              muted
            />
          </div>
          
          <div className="flex justify-center">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Start Streaming
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Stop Streaming
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamSetupPage;
