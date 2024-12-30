import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { FrontendController } from './frontend.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { StreamModule } from 'src/stream/stream.module';

import { User } from 'src/user/entities/user.entity';
import { Stream } from 'src/stream/entities/stream.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'emumba_streaming.db',
      entities: [User, Stream, Chat],
      synchronize: true, // Disable in production
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'streams'),
      serveRoot: '/streams',
    }),
    AuthModule,
    UserModule,
    StreamModule,
    ChatModule,
  ],
  controllers: [AppController, FrontendController],
  providers: [AppService],
})
export class AppModule {}
