import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StreamService } from './stream.service';

@Processor('liveStream')
export class LiveStreamProcessor {
  constructor(private readonly streamService: StreamService) {}

  @Process('convert')
  async handleLiveConversion(job: Job) {
    
    const { id } = job.data;
    await this.streamService.encodeLiveStream(id);
  }
}