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
}
