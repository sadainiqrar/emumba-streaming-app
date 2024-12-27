import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/typeorm/entities/user.entity';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(details: UserDetails) {
    const user = await this.userRepository.findOne({ where: { email: details.email } });

    if (user) return user
    else return this.userRepository.save(details);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
