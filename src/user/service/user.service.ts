import { Injectable } from '@nestjs/common';
import {
  IUserEntity,
  IUserCreate,
  IUserUpdate,
  IUserCheckExist,
} from '@/user/user.interface';
import { plainToInstance } from 'class-transformer';
import { IAwsS3Response } from '@/aws/aws.interface';
import { IAuthPassword } from '@/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { HelperStringService } from '@/utils/helper/service/helper.string.service';
import { User } from '../entity/user.entity';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from '@/database/database.interface';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';
import { UserListSerialization } from '../serialization/user.list.serialization';
import { UserGetSerialization } from '../serialization/user.get.serialization';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

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

  create(props: DeepPartial<User>): User {
    return this.userRepository.create(props);
  }

  createMany(props: DeepPartial<User>[]): User[] {
    return this.userRepository.create(props);
  }

  async findOne(find: Record<string, any>): Promise<User> {
    return this.userRepository.findOne(find);
  }

  async findOneById(id: string, options: Record<string, any>): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: options.relations,
    });
  }
}
