import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { IGoogleBody } from './interface/IGoogleBody';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password: pass } = signInDto;

    const user = await this.userService.findUser(email, true);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user._id, email: user.email };
    const access_token = this.createJWTCredential(payload);
    return access_token;
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
      const user = await this.userService.createUser(newUser);
      const payload = { sub: user._id, email: user.email };
      const access_token = this.createJWTCredential(payload);
      return access_token;
    } catch (e) {
      throw new HttpException(
        'Email already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  async findOrCreateGoogleUser(googleBody: IGoogleBody) {
    const {
      email,
      family_name: firstName,
      given_name: lastName,
      picture,
    } = googleBody;
    let findUser = await this.userService.findUser(email);
    if (!findUser) {
      const newUser = {
        email,
        firstName,
        lastName,
        profilePicture: picture,
        createdAt: new Date(),
        forms: [],
      };
      findUser = await this.userService.createUser(newUser);
    }
    const access_token = this.createJWTCredential({
      sub: findUser._id,
      email: findUser.email,
    });
    return access_token;
  }

  async createJWTCredential(payload: { sub: any; email: string }) {
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
