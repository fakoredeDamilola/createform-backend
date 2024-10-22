import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { GoogleOAuthGuard } from './guard/google-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { Public } from '../decorators/public-routes.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';

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

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() signUpDto: SignUpDto) {
    return this.authService.registerLocal(signUpDto);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    const response = req.user;
    return {
      user: response.user,
      access_token: response.access_token,
    };
  }
}
