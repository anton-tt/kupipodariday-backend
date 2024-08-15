import { Controller, UseGuards, Body, Post, Request } from '@nestjs/common';
import { LocalGuard } from './guards/local-auth';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { SignupUserResponseDto } from '../users/dto/signup-response-user.dto';
import { SigninUserResponseDto } from '../users/dto/signin-response-user.dto';
import { SIGNUP_PATH, SIGNIN_PATH } from '../utils/consts';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post(SIGNUP_PATH)
  async signupUser(
    @Body() user: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.usersService.create(user);
  }

  @UseGuards(LocalGuard)
  @Post(SIGNIN_PATH)
  async signin(@Body() user: SigninUserDto): Promise<SigninUserResponseDto> {
    return this.authService.auth(user);
  }
}
