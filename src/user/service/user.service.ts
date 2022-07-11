import { Injectable } from '@nestjs/common';
import { IAuthPassword } from '@/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { IUserCheckExist } from '../user.interface';

@Injectable()
export class UserService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(User, ConnectionNames.Default)
    private userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async create(props: DeepPartial<User>): Promise<User> {
    return this.userRepository.create(props);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save<User>(user);
  }

  async findOne(find: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User> {
    return this.userRepository.findOneBy(find);
  }

  async findOneById(id: string, options?: Record<string, any>): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: options?.relations,
      select: options?.select,
    });
  }

  async updatePassword(
    id: string,
    { salt, passwordHash, passwordExpiredAt }: IAuthPassword,
  ): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    user.authConfig.password = passwordHash;
    user.authConfig.passwordExpiredAt = passwordExpiredAt;
    user.authConfig.salt = salt;

    return this.userRepository.save(user);
  }

  async checkExistsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.findOne({
      where: { email },
    });

    return Boolean(exists);
  }

  async checkExist(
    email: string,
    mobileNumber?: string,
  ): Promise<IUserCheckExist> {
    const existEmail = await this.findOneBy({ email });

    const existMobileNumber =
      mobileNumber && (await this.findOneBy({ mobileNumber }));

    return {
      email: existEmail ? true : false,
      mobileNumber: existMobileNumber ? true : false,
    };
  }
}
