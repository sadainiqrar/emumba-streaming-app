import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';

import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { WebSocketJwtGuard } from 'src/utils/Guards';
import { WebSocketAuthMiddleware } from 'src/common/middleware/websocket-auth.middleware';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
@UseGuards(WebSocketJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(client: Socket) {
    client.use((WebSocketAuthMiddleware() as any))
  }

  handleConnection(client: Socket) {
    console.log(`chat:: socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`chat:: socket disconnected: ${client.id}`);
    const rooms = Array.from(client.rooms.values());
    rooms.forEach((room) => {
      if (room !== client.id) {
        client.leave(room);
        console.log(`chat:: client ${client.id} left room ${room}`);
      }
    });
  }

  @SubscribeMessage('joinStream')
  async handleJoinStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.join(streamId);
    console.log(`Client ${client.id} joined stream ${streamId}`);
    client.emit('joinedStream', `You joined stream ${streamId}`);
  }

  @SubscribeMessage('leaveStream')
  async handleLeaveStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.leave(streamId);
    console.log(`Client ${client.id} left stream ${streamId}`);
    client.emit('leftStream', `You left stream ${streamId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() createChatDto: CreateChatDto) {
    const newChat = await this.chatService.create(createChatDto);
    this.server.to(createChatDto.streamId).emit('receiveMessage', newChat);
    console.log(`New message sent to stream ${createChatDto.streamId}`);
  }
}
