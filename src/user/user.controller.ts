import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findUser(@Request() req) {
    const email = req.user.email;
    return this.userService.findUser(email);
  }
}
