import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { StreamModule } from 'src/stream/stream.module';

import { User } from 'src/user/entities/user.entity';
import { Stream } from 'src/stream/entities/stream.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'emumba_streaming.db',
      entities: [User, Stream],
      synchronize: true, // Disable in production
    }),
    AuthModule,
    UserModule,
    StreamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
