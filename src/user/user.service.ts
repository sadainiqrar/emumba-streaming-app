import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    user.role = createUserDto.role || 'user'
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(params: Partial<User>) {
    return this.userRepository.findOne({ where: { ...params } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id })

    if (!user) {
      return { message: 'User not found' }
    }

    user.name = updateUserDto.name
    return await this.userRepository.save(user)
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
