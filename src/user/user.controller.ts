import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/decorators/public-routes.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create() {}

  @Public()
  @Get('/me')
  async findUser(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.findUser(email);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
