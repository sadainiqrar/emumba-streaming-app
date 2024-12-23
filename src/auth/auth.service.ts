import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
