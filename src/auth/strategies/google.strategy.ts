import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const user = await this.authService.validateUser({ 
      googleId: profile.id,
      name: profile.displayName, 
      email: profile.emails[0].value,
      accessToken
    });

    done(null, user);
  }
}
