import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password: pass } = signInDto;
    const user = await this.userService.findUser(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user._id, username: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    } else {
      this.createNewUser(req.user);
      return {
        message: 'User information from google',
        user: req.user,
      };
    }
  }

  async registerLocal(signUpDto: SignUpDto) {
    try {
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      const newUser = {
        ...signUpDto,
        password: hashedPassword,
        createdAt: new Date(),
        forms: [],
      };
      return this.userService.createUser(newUser);
    } catch (e) {
      throw new Error(e);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUser(email);

    if (
      user &&
      user.password === pass &&
      (await bcrypt.compare(pass, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createNewUser(user: any) {
    const { email, firstName, lastName, picture } = user;
    const newUser = {
      email,
      firstName,
      lastName,
      profilePicture: picture,
      createdAt: new Date(),
      forms: [],
    };
    return this.userService.createUser(newUser);
  }
}
