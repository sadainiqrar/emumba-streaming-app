import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream } from './entities/stream.entity';
import { StreamProcessor } from './stream.processor';
import { LiveStreamProcessor } from './liveStream.processor';
import { StreamGateway } from './stream.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stream]),
    BullModule.registerQueue(
      {
        name: 'stream',
      },
      { name: 'liveStream' }
    ),
  ],
  controllers: [StreamController],
  providers: [StreamGateway, StreamService, StreamProcessor, LiveStreamProcessor],
})
export class StreamModule {}
