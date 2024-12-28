import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('stream/:streamId')
  async findByStream(@Param('streamId') streamId: string) {
    return await this.chatService.findByStream(streamId);
  }
}