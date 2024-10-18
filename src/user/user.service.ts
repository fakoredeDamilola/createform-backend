import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User) {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    console.log({ users });
  }

  async findUser(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    console.log({ user });
    return user;
  }
}
