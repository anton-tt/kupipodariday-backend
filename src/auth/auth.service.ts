import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SigninUserResponseDto } from '../users/dto/signin-response-user.dto';
import { User } from '../users/entities/user.entity';
import { SigninUserDto } from '../users/dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersService.getUserByName(username);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  auth(user: SigninUserDto): SigninUserResponseDto {
    const payload = { username: user.username, sub: user.id };
    const access_token: string = this.jwtService.sign(payload);
    return new SigninUserResponseDto(access_token);
  }
}
