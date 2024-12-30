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
    @InjectQueue('stream') private readonly streamQueue: Queue
  ) {}

  async create(createStreamDto: CreateStreamDto): Promise<Stream> {
    const newStream = this.streamRepository.create(createStreamDto);
    return await this.streamRepository.save(newStream);
  }

  async endStream(id: string): Promise<Stream> {
    const stream = await this.findOne(id);
    stream.status = 'completed';
    stream.endedAt = new Date();
    await this.streamRepository.save(stream);

    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', id);
    if (fs.existsSync(uploadsDir)) {
      fs.rmdirSync(uploadsDir, { recursive: true });
      console.log(`Uploads directory ${uploadsDir} removed`);
    }

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

  async uploadStream(id: string, file: any) {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', id);

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const chunkPath = path.join(uploadsDir, `${Date.now()}.webm`);
    fs.writeFileSync(chunkPath, file.buffer);
    // Add the upload and conversion task to the queue
    await this.streamQueue.add('convert', { id, uploadsDir });
  }

  async startHlsStream(streamId: string, inputDir: string) {
    const stream = await this.findOne(streamId);
    const outputDir = path.join(__dirname, '..', '..', 'streams', streamId);
    const output = path.join(outputDir, 'index.m3u8');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileListPath = path.join(inputDir, 'filelist.txt');
    const files = fs
      .readdirSync(inputDir)
      .filter((file) => file.endsWith('.webm'));
    const fileListContent = files
      .map((file) => `file '${path.join(inputDir, file)}'`)
      .join('\n');
    fs.writeFileSync(fileListPath, fileListContent);

    ffmpeg(fileListPath)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions([
        '-preset veryfast',
        '-g 50',
        '-sc_threshold 0',
        '-map 0:0',
        '-map 0:1',
        '-map 0:0',
        '-map 0:1',
        '-s:v:0 640x360',
        '-b:v:0 800k',
        '-s:v:1 1280x720',
        '-b:v:1 3000k',
        '-c:v libx264',
        '-c:a aac',
        '-ar 48000',
        '-b:a 128k',
        '-f hls',
        '-hls_time 6',
        '-hls_playlist_type event',
        '-hls_segment_filename',
        path.join(outputDir, '%03d.ts'),
      ])
      .output(output)
      .on('end', () => {
        console.log('HLS stream ended');
      })
      .on('error', (err) => {
        console.error('Error in HLS stream:', err);
      })
      .run();
  }
}
