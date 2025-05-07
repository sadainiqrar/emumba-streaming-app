import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async validateUser(details: CreateUserDto) {
    const user = await this.userService.findOne({ email: details.email })

    if (user) return user
    else return this.userService.create(details);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    try {
      // Include more user information in the token payload
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        googleId: user.googleId
      };

      console.log('Generating token for user:', {
        id: user.id,
        email: user.email,
        name: user.name
      });

      // Get the JWT secret
      const secret = process.env.JWT_SECRET || 'secretKey';
      console.log('Using JWT secret:', secret ? '[SECRET CONFIGURED]' : 'default fallback secret');

      // Sign the token with a longer expiration
      const token = this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: '7d' // 7 days
      });

      // Verify the token to make sure it's valid
      try {
        const verified = this.jwtService.verify(token, { secret });
        console.log('Token verified successfully:', {
          id: verified.id,
          exp: new Date(verified.exp * 1000).toISOString()
        });
      } catch (verifyError) {
        console.error('Token verification failed:', verifyError);
        throw new Error('Failed to verify generated token: ' + verifyError.message);
      }

      return { accessToken: token };
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Failed to generate token: ' + error.message);
    }
  }
}
