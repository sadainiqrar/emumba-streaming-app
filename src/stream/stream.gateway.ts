import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { StreamService } from './stream.service';
import { WebSocketJwtGuard } from 'src/utils/Guards';
import { WebSocketAuthMiddleware } from 'src/common/middleware/websocket-auth.middleware';

@WebSocketGateway({
  namespace: 'stream',
  cors: {
    origin: '*',
  },
})
@UseGuards(WebSocketJwtGuard)
export class StreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private ffmpegProcess: ChildProcessWithoutNullStreams;

  constructor(private readonly streamService: StreamService) {}

  afterInit(client: Socket) {
    client.use((WebSocketAuthMiddleware() as any))
  }

  handleConnection(client: Socket) {
    console.log(`stream:: socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`stream:: socket disconnected: ${client.id}`);
    const rooms = Array.from(client.rooms.values());
    rooms.forEach((room) => {
      if (room !== client.id) {
        client.leave(room);
        console.log(`stream:: client ${client.id} left room ${room}`);
      }
    });
  }

  @SubscribeMessage('videoChunk')
  async handleVideoChunk(
    @MessageBody() data: { streamId: string; chunk: Buffer },
    @ConnectedSocket() client: Socket
  ) {
    const { chunk } = data;

    if (this.ffmpegProcess) {
      this.ffmpegProcess.stdin.write(chunk);
      console.log(`Received video chunk for stream ${data.streamId}`);
    } else {
      console.error('FFmpeg process is not running');
    }
  }

  @SubscribeMessage('startStream')
  async handleStartStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.join(streamId);
    console.log(`Stream started with ID ${streamId}`);
    this.server.to(streamId).emit('streamStarted', { streamId });

    this.ffmpegProcess = spawn('ffmpeg', [
      '-i',
      'pipe:0', // input from WebSocket
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-maxrate',
      '1500k',
      '-bufsize',
      '3000k',
      '-f',
      'flv',
      `rtmp://localhost:1935/live/${streamId}`, // RTMP server URL
    ]);

    // this.streamService.encodeLiveStream(streamId)
    this.ffmpegProcess.stdin.on('error', (err) => {
      console.error('FFmpeg stdin error:', err);
    });

    this.ffmpegProcess.stderr.on('data', (data) => {
      console.log('FFmpeg data:', data.toString());
    });

    this.ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process closed with code ${code}`);
    });
  }

  @SubscribeMessage('endStream')
  async handleEndStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.leave(streamId);
    console.log(`Stream ended with ID ${streamId}`);
    this.server.to(streamId).emit('streamEnded', { streamId });

    // Stop the ffmpeg process
    if (this.ffmpegProcess) {
      this.ffmpegProcess.stdin.end();
      this.ffmpegProcess.kill('SIGINT');
    }
  }
}
