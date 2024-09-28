import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!email.match(regex)) throw "This is not a valid email address!"
    const user = await this.userService.findOne(email);
    const isMatch = await bcrypt.compare(pass, user?.user_password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    // const { user_password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      success: true,
      id: user.user_id,
      email: user.user_email
    };
  }
}
