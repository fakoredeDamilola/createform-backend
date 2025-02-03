import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, MongooseError } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: User) {
    try {
      const createdUser = new this.userModel(user);
      return createdUser.save();
    } catch (e) {
      console.log('an error here');
      if (e instanceof MongooseError) {
        throw new Error('User already exists with this email or username');
      }
      throw new Error('An error occurred while creating the user');
    }
  }

  async findAll() {
    const users = await this.userModel.find().exec();
  }

  async findUser(email: string, password?: boolean) {
    let query = this.userModel.findOne({ email });
    if (!password) {
      query = query.select('-password');
    }
    const user = await query;
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
