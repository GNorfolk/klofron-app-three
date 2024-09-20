import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller({
  path: 'auth',
  version: '2',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // curl --request POST localhost:5000/v2/auth/login --header "Content-Type: application/json" --data '{"email": "admin@klofron.uk", "password": "password"}'
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
