import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { join } from 'path';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('success')
  getAuthSuccessPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'auth-success.html'));
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  handleLogin() {
    return { message: 'Google Authentication' };
  }

  // Google redirects here after successful authentication
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const token = await this.authService.generateToken(req.user);
    const profile = {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      accessToken: token.accessToken,
    };
    const profileString = encodeURIComponent(JSON.stringify(profile));
    res.redirect(`/api/auth/success?profile=${profileString}`);
  }

  // Protect this route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
