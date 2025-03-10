import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Public } from '../decorators/public-routes.decorator';
import { IGoogleBody } from './interface/IGoogleBody';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Post('/logout')
  async logout(@Request() req) {
    req.user = null;
    return '';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.registerLocal(signUpDto);
  }

  @Public()
  @Post('/google/create')
  createGoogleAccount(@Body('response') googleBody: IGoogleBody) {
    return this.authService.findOrCreateGoogleUser(googleBody);
  }
}
