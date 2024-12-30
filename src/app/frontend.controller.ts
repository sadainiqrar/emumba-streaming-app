import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('frontend')
export class FrontendController {
  @Get('watch')
  getWatchPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'watch.html'));
  }
  
  @Get()
  getFrontendPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'index.html'));
  }
}