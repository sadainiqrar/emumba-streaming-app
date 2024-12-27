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
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
