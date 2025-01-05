import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from 'src/chat/entities/chat.entity'
import { Stream } from 'src/stream/entities/stream.entity'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Stream)
    private readonly streamRepository: Repository<Stream>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const { streamId, userId, message } = createChatDto;

    const stream = await this.streamRepository.findOne({ where: { id: streamId } });
    if (!stream) {
      throw new NotFoundException(`Stream with ID ${streamId} not found.`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const newChat = this.chatRepository.create({
      message,
      stream,
      user,
    });

    return await this.chatRepository.save(newChat);
  }

  async findByStream(streamId: string): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { stream: { id: streamId } },
      relations: ['user', 'stream'],
      select: {
        id: true,
        message: true,
        sentAt: true,
        user: { id: true },
        stream: { id: true },
      }
    });
  }
}