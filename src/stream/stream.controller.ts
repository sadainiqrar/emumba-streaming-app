import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { StreamService } from './stream.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

@Controller('streams')
@UseGuards(AuthGuard('jwt'))
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post()
  create(@Body() createStreamDto: CreateStreamDto) {
    createStreamDto.url = `/streams/${Date.now()}`;
    return this.streamService.create(createStreamDto);
  }

  @Get()
  findAll() {
    return this.streamService.findAll();
  }

  // please write code to get the stream by status
  @Get('status/:status')
  findByStatus(@Param('status') status: 'active' | 'completed') {
    return this.streamService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streamService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStreamDto: UpdateStreamDto) {
    return this.streamService.update(id, updateStreamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.streamService.remove(id);
  }  

  @Patch(':id/end')
  async endStream(@Param('id') id: string, @Body() updateStreamDto: UpdateStreamDto) {
    return this.streamService.endStream(id, { duration: updateStreamDto.duration });
  }
}
