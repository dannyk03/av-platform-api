import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  IUserDocument,
  IUserCreate,
  IUserUpdate,
  IUserCheckExist,
} from 'src/user/user.interface';
import { Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IAuthPassword } from 'src/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { DatabaseEntity } from 'src/database/database.decorator';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { UserDocument, UserEntity } from '../schema/user.schema';
import { IDatabaseFindAllOptions } from 'src/database/database.interface';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';
import { UserListSerialization } from '../serialization/user.list.serialization';
import { UserGetSerialization } from '../serialization/user.get.serialization';

@Injectable()
export class UserService {
  private readonly uploadPath: string;

  constructor(
    @DatabaseEntity(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    private readonly helperStringService: HelperStringService,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<IUserDocument[]> {
    const users = this.userModel.find(find);

    if (options && options.limit !== undefined && options.skip !== undefined) {
      users.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      users.sort(options.sort);
    }

    return users.lean();
  }

  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.userModel.countDocuments(find);
  }

  async serializationProfile(
    data: IUserDocument,
  ): Promise<UserProfileSerialization> {
    return plainToInstance(UserProfileSerialization, data);
  }

  async serializationList(
    data: IUserDocument[],
  ): Promise<UserListSerialization[]> {
    return plainToInstance(UserListSerialization, data);
  }

  async serializationGet(data: IUserDocument): Promise<UserGetSerialization> {
    return plainToInstance(UserGetSerialization, data);
  }

  async findOneById<T>(_id: string): Promise<T> {
    const user = this.userModel.findById(_id);

    return user.lean();
  }

  async findOne<T>(find?: Record<string, any>): Promise<T> {
    const user = this.userModel.findOne(find);

    return user.lean();
  }

  async create({
    firstName,
    lastName,
    password,
    passwordExpired,
    salt,
    email,
  }: IUserCreate): Promise<UserDocument> {
    const user: UserEntity = {
      firstName,
      email,
      password,
      isActive: true,
      lastName: lastName || undefined,
      salt,
      passwordExpired,
    };

    const create: UserDocument = new this.userModel(user);
    return create.save();
  }

  async deleteOneById(_id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(_id);
  }

  async deleteOne(find: Record<string, any>): Promise<UserDocument> {
    return this.userModel.findOneAndDelete(find);
  }

  async updateOneById(
    _id: string,
    { firstName, lastName }: IUserUpdate,
  ): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.firstName = firstName;
    user.lastName = lastName || undefined;

    return user.save();
  }

  async checkExist(
    email: string,
    mobileNumber: string,
    _id?: string,
  ): Promise<IUserCheckExist> {
    const existEmail: Record<string, any> = await this.userModel.exists({
      email: {
        $regex: new RegExp(email),
        $options: 'i',
      },
      _id: { $nin: [new Types.ObjectId(_id)] },
    });

    return {
      email: existEmail ? true : false,
    };
  }

  async createRandomFilename(): Promise<Record<string, any>> {
    const filename: string = this.helperStringService.random(20);

    return {
      path: this.uploadPath,
      filename: filename,
    };
  }

  async updatePassword(
    _id: string,
    { salt, passwordHash, passwordExpired }: IAuthPassword,
  ): Promise<UserDocument> {
    const auth: UserDocument = await this.userModel.findById(_id);

    auth.password = passwordHash;
    auth.passwordExpired = passwordExpired;
    auth.salt = salt;

    return auth.save();
  }

  async updatePasswordExpired(
    _id: string,
    passwordExpired: Date,
  ): Promise<UserDocument> {
    const auth: UserDocument = await this.userModel.findById(_id);
    auth.passwordExpired = passwordExpired;

    return auth.save();
  }

  async inactive(_id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.isActive = false;
    return user.save();
  }

  async active(_id: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findById(_id);

    user.isActive = true;
    return user.save();
  }
}
