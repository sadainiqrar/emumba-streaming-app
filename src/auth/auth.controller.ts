import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  handleLogin() {
    return { message: 'Google Authentication' }
  }

  // Google redirects here after successful authentication
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const token = await this.authService.generateToken(req.user);

    return {
      message: 'User authenticated successfully',
      user: req.user,
      token,
    };
  }

  // Protect this route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
