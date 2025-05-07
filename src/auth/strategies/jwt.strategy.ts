import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
    // Log the JWT secret being used (don't do this in production)
    console.log('JwtStrategy: Using JWT secret:', process.env.JWT_SECRET ? '[SECRET CONFIGURED]' : 'default fallback secret');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    // Log the request headers to see what's being sent
    console.log('JwtStrategy: Request headers:', request.headers);

    try {
      // Extract the token from the Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        console.error('JwtStrategy: No Authorization header found');
        throw new UnauthorizedException('No Authorization header found');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        console.error('JwtStrategy: No token found in Authorization header');
        throw new UnauthorizedException('No token found in Authorization header');
      }

      console.log('JwtStrategy: Token extracted from header:', token.substring(0, 10) + '...');

      // Verify the token manually to ensure it's valid
      try {
        // This will throw an error if the token is invalid
        const verifiedPayload = this.jwtService.verify(token);
        console.log('JwtStrategy: Token verified successfully, payload:', verifiedPayload);
      } catch (verifyError) {
        console.error('JwtStrategy: Token verification failed:', verifyError.message);
        throw new UnauthorizedException('Invalid token: ' + verifyError.message);
      }

      console.log('JwtStrategy: Validating token payload:', { payload });

      if (!payload || !payload.id) {
        console.error('JwtStrategy: Invalid payload or missing id');
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.findOne({ id: payload.id });

      if (!user) {
        console.error(`JwtStrategy: User not found for id ${payload.id}`);
        throw new UnauthorizedException('User not found');
      }

      console.log(`JwtStrategy: User authenticated successfully: ${user.email}`);
      return user;
    } catch (error) {
      console.error('JwtStrategy: Validation error', error);
      throw new UnauthorizedException('Authentication failed: ' + (error.message || 'Unknown error'));
    }
  }
}
