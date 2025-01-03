import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import NodeMediaServer from 'node-media-server';
import ffmpeg from 'fluent-ffmpeg';

// import { StreamService } from '../stream/stream.service';

import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaServerService implements OnModuleInit, OnModuleDestroy {
  private nms: NodeMediaServer;

  onModuleInit() {
    const config = {
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
      },
      http: {
        port: 8080,
        allow_origin: '*',
        mediaroot: './uploads',
      },
      trans: {
        ffmpeg: require('@ffmpeg-installer/ffmpeg').path, // Path to FFmpeg from ffmpeg-fluent
        tasks: [
          {
            app: 'live',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
            mp4: true,
            mp4Flags: '[movflags=frag_keyframe+empty_moov]',
          },
        ],
      },
      MediaRoot: './uploads'
    };
    
    this.nms = new NodeMediaServer(config);
    this.nms.run();
    
    console.log('RTMP server started on port 1935');
    // this.nms.on('prePublish', async (id, StreamPath, args) => {
    //   // TODO: add validation here
    //   console.log('prePublish args', { id, StreamPath, args });
    // });
    
    // this.nms.on('donePublish', (id, StreamPath, args) => {
    //   console.log('donePublish args', { id, StreamPath, args });
    // });

    // this.nms.on('preConnect', (id, StreamPath, args) => {
    //   console.log('preConnect args', { id, StreamPath, args });
    // });

    // this.nms.on('postPlay', (id, StreamPath, args) => {
    //   console.log('postPlay args', { id, StreamPath, args });
    // });
    
  }

  onModuleDestroy() {
    if (this.nms) {
      this.nms.stop();
      console.log('RTMP server stopped');
    }
  }
}
