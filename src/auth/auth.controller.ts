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
    // Read the auth-success.html file
    const filePath = join(__dirname, '..', '..', 'public', 'auth-success.html');
    let html = require('fs').readFileSync(filePath, 'utf8');

    // Replace the frontend URL with the environment variable
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    html = html.replace('content="http://localhost:5173"', `content="${frontendUrl}"`);

    // Send the modified HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
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
    try {
      console.log('Google auth redirect - user:', {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      });

      const token = await this.authService.generateToken(req.user);
      console.log('Generated token:', token.accessToken.substring(0, 10) + '...');

      // Include role and googleId in the profile
      const profile = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role || 'user',
        googleId: req.user.googleId,
        accessToken: token.accessToken,
      };

      const profileString = encodeURIComponent(JSON.stringify(profile));
      res.redirect(`/api/auth/success?profile=${profileString}`);
    } catch (error) {
      console.error('Error in Google auth redirect:', error);
      res.status(500).send('Authentication error: ' + error.message);
    }
  }

  // Protect this route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
