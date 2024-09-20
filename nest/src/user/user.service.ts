import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/User'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async findOne(email: string): Promise<User> {
    const user = this.userRepository
      .createQueryBuilder("user")
      .where("user.user_email = :email", { email: email })
    return await user.getOne();
  }
}
