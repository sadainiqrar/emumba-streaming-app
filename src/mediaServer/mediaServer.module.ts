import { Module } from '@nestjs/common';
import { MediaServerService } from './mediaServer.service';

@Module({
  providers: [MediaServerService],
})
export class MediaServerModule {}
