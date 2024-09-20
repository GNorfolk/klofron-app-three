import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller({
  path: 'user',
  version: '2',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }
}
