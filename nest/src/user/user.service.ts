import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/User'
import * as bcrypt from 'bcryptjs';

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

  async create(user: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let result
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await queryRunner.manager
        .createQueryBuilder(User, "user")
        .where("user.user_email = :email", { email: user.user_email })
        .getMany();
      if (existing.length > 0) throw "This email is already in use!"
      if (user.user_password !== user.retype_password) throw "Passwords do not match!"
      user.user_username = user.user_email;
      user.user_password = await bcrypt.hash(user.user_password, 10);
      result = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return result.user_id
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(err);
    }
  }
}
