import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private handleExpections(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User can't be duplicated ${JSON.stringify(error.keyValue)}`,
      );
    }

    throw new BadRequestException(`Error found, can't perform the operation `);
  }

  async create(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (error) {
      return this.handleExpections(error);
    }
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().select('-password, -__v').exec();
    if (!users) throw new NotFoundException('User not found');
    return users;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.preferences) {
      updateUserDto.preferences = {
        ...user.preferences,
        ...updateUserDto.preferences,
      };
    }

    return this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateUserDto },
      { new: true }, // Return the updated document
    );
  }

  async delete(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) throw new NotFoundException('User not found');
  }
}
