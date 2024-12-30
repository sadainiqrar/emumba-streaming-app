import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream } from './entities/stream.entity';
import { StreamProcessor } from './stream.processor';

@Module({
  imports: [TypeOrmModule.forFeature([Stream]), 
  BullModule.registerQueue({
    name: 'stream',
  }),],
  controllers: [StreamController],
  providers: [StreamService, StreamProcessor],
})
export class StreamModule {}
