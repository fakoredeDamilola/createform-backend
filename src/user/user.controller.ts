import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findUser(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.findUser(email);
  }
}
