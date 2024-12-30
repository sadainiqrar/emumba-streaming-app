import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StreamService } from './stream.service';

@Processor('stream')
export class StreamProcessor {
  constructor(private readonly streamService: StreamService) {}

  @Process('convert')
  async handleConversion(job: Job) {
    
    const { id, uploadsDir } = job.data;
    await this.streamService.startHlsStream(id, uploadsDir);
  }
}