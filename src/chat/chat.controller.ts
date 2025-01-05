import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { RolesGuard } from 'src/utils/Guards';
import { Roles } from 'src/utils/decorators';
import { Role } from 'src/utils/enums';

@Controller('chat')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('stream/:streamId')
  @Roles(Role.Admin)
  async findByStream(@Param('streamId') streamId: string) {
    return await this.chatService.findByStream(streamId);
  }
}