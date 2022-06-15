import { Injectable } from '@nestjs/common';
import {
  IUserEntity,
  IUserCreate,
  IUserUpdate,
  IUserCheckExist,
} from 'src/user/user.interface';
import { plainToInstance } from 'class-transformer';
import { IAwsS3Response } from 'src/aws/aws.interface';
import { IAuthPassword } from 'src/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { User } from '../entity/user.entity';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';
import { UserListSerialization } from '../serialization/user.list.serialization';
import { UserGetSerialization } from '../serialization/user.get.serialization';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(User, ConnectionNames.Default)
    private userRepository: Repository<User>,
    private readonly helperStringService: HelperStringService,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<any[] | any> {
    // const users = this.userRepository.find(find).populate({
    //   path: 'role',
    //   model: RoleEntity.name,
    // });
    // if (options && options.limit !== undefined && options.skip !== undefined) {
    //   users.limit(options.limit).skip(options.skip);
    // }
    // if (options && options.sort) {
    //   users.sort(options.sort);
    // }
    // return users.lean();
  }

  async getTotal(find?: Record<string, any>): Promise<any> {
    // return this.userRepository.countDocuments(find);
  }

  async serializationProfile(
    data: IUserEntity,
  ): Promise<UserProfileSerialization> {
    return plainToInstance(UserProfileSerialization, data);
  }

  async serializationList(
    data: IUserEntity[],
  ): Promise<UserListSerialization[]> {
    return plainToInstance(UserListSerialization, data);
  }

  async serializationGet(data: IUserEntity): Promise<UserGetSerialization> {
    return plainToInstance(UserGetSerialization, data);
  }

  async findOneById<T>(id: string, options?): Promise<T | any> {
    // const user = this.userRepository.findById(id);
    // if (options && options.populate && options.populate.role) {
    //   user.populate({
    //     path: 'role',
    //     model: RoleEntity.name,
    //   });
    //   if (options.populate.permission) {
    //     user.populate({
    //       path: 'role',
    //       model: RoleEntity.name,
    //       populate: {
    //         path: 'permissions',
    //         model: PermissionEntity.name,
    //       },
    //     });
    //   }
    // }
    // return user.lean();
  }

  async findOne<T>(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions<User>,
  ): Promise<any> {
    // const user = this.userRepository.findOne(find);
    // if (options && options.populate && options.populate.role) {
    //   user.populate({
    //     path: 'role',
    //     model: RoleEntity.name,
    //   });
    //   if (options.populate.permission) {
    //     user.populate({
    //       path: 'role',
    //       model: RoleEntity.name,
    //       populate: {
    //         path: 'permissions',
    //         model: PermissionEntity.name,
    //       },
    //     });
    //   }
    // }
    // return user.lean();
  }

  async create({
    firstName,
    lastName,
    password,
    passwordExpired,
    salt,
    email,
    mobileNumber,
    role,
  }: IUserCreate): Promise<any> {
    // const user: UserEntity = {
    //   firstName,
    //   email,
    //   mobileNumber,
    //   password,
    //   role: new Types.ObjectId(role),
    //   isActive: true,
    //   lastName: lastName || undefined,
    //   salt,
    //   passwordExpired,
    // };
    // const create: UserDocument = new this.userRepository(user);
    // return create.save();
  }

  async deleteOneById(id: string): Promise<any> {
    // return this.userRepository.findByIdAndDelete(id);
  }

  async deleteOne(find: Record<string, any>): Promise<any> {
    // return this.userRepository.findOneAndDelete(find);
  }

  async updateOneById(
    id: string,
    { firstName, lastName }: IUserUpdate,
  ): Promise<any> {
    // const user: UserDocument = await this.userRepository.findById(id);
    // user.firstName = firstName;
    // user.lastName = lastName || undefined;
    // return user.save();
  }

  async checkExist(
    email: string,
    mobileNumber: string,
    id?: string,
  ): Promise<IUserCheckExist | any> {
    // const existEmail: Record<string, any> = await this.userRepository.exists({
    //   email: {
    //     $regex: new RegExp(email),
    //     $options: 'i',
    //   },
    //   id: { $nin: [new Types.ObjectId(id)] },
    // });
    // const existMobileNumber: Record<string, any> =
    //   await this.userRepository.exists({
    //     mobileNumber,
    //     id: { $nin: [new Types.ObjectId(id)] },
    //   });
    // return {
    //   email: existEmail ? true : false,
    //   mobileNumber: existMobileNumber ? true : false,
    // };
  }

  async updatePhoto(id: string, aws: IAwsS3Response): Promise<any> {
    // const user: UserDocument = await this.userRepository.findById(id);
    // user.photo = aws;
    // return user.save();
  }

  async createRandomFilename(): Promise<Record<string, any>> {
    const filename: string = this.helperStringService.random(20);

    return {
      path: this.uploadPath,
      filename: filename,
    };
  }

  async updatePassword(
    id: string,
    { salt, passwordHash, passwordExpired }: IAuthPassword,
  ): Promise<any> {
    // const auth: UserDocument = await this.userRepository.findById(id);
    // auth.password = passwordHash;
    // auth.passwordExpired = passwordExpired;
    // auth.salt = salt;
    // return auth.save();
  }

  async updatePasswordExpired(id: string, passwordExpired: Date): Promise<any> {
    // const auth: UserDocument = await this.userRepository.findById(id);
    // auth.passwordExpired = passwordExpired;
    // return auth.save();
  }

  async inactive(id: string): Promise<any> {
    // const user: UserDocument = await this.userRepository.findById(id);
    // user.isActive = false;
    // return user.save();
  }

  async active(id: string): Promise<any> {
    // const user: UserDocument = await this.userRepository.findById(id);
    // user.isActive = true;
    // return user.save();
  }
}
