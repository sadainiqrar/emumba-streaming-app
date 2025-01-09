import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ffmpeg from 'fluent-ffmpeg';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import * as fs from 'fs';
import * as path from 'path';

import { Repository } from 'typeorm';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { Stream } from './entities/stream.entity';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(Stream)
    private readonly streamRepository: Repository<Stream>,
    @InjectQueue('stream') private readonly streamQueue: Queue,
    @InjectQueue('liveStream') private readonly liveStreamQueue: Queue
  ) {}

  async create(createStreamDto: CreateStreamDto): Promise<Stream> {
    const newStream = this.streamRepository.create(createStreamDto);
    const stream = await this.streamRepository.save(newStream);
    return stream;
  }

  async endStream(id: string, data: UpdateStreamDto): Promise<Stream> {
    const stream = await this.findOne(id);
    stream.status = 'completed';
    stream.endedAt = new Date();
    stream.duration = data.duration

    await this.streamRepository.save(stream);
    return stream;
  }

  async findAll(): Promise<Stream[]> {
    return await this.streamRepository.find();
  }

  async findOne(id: string): Promise<Stream> {
    const stream = await this.streamRepository.findOne({ where: { id } });
    if (!stream) {
      throw new NotFoundException(`Stream with ID ${id} not found`);
    }
    return stream;
  }

  async update(id: string, updateStreamDto: UpdateStreamDto): Promise<Stream> {
    const stream = await this.findOne(id);
    Object.assign(stream, updateStreamDto);
    return await this.streamRepository.save(stream);
  }

  async remove(id: string): Promise<void> {
    const stream = await this.findOne(id);
    await this.streamRepository.remove(stream);
  }

  

  
}
