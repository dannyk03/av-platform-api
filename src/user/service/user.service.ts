import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumUserStatusCodeError } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { User } from '../entity';

import {
  UserGetSerialization,
  UserProfileGetSerialization,
} from '../serialization';

import { IUserCheckExist, IUserSearch } from '../user.interface';
import { IAuthPassword } from '@/auth/auth.interface';

import { ConnectionNames } from '@/database';

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
    phoneNumber?: string,
  ): Promise<IUserCheckExist> {
    const existEmail = await this.findOneBy({ email });

    const existsPhoneNumber =
      phoneNumber && (await this.findOneBy({ phoneNumber }));

    return {
      email: existEmail ? true : false,
      phoneNumber: existsPhoneNumber ? true : false,
    };
  }

  async getListSearchBuilder({
    search,
    isActive,
  }: IUserSearch): Promise<SelectQueryBuilder<User>> {
    const builder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.authConfig', 'authConfig');

    if (isActive?.length) {
      builder.where('user.isActive = ANY(:isActive)', { isActive });
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('user.email ILIKE :likeSearch')
            .orWhere('user.phoneNumber ILIKE :likeSearch')
            .orWhere('profile.firstName ILIKE :likeSearch')
            .orWhere('profile.lastName ILIKE :likeSearch')
            .orWhere('profile.title ILIKE :likeSearch');
        }),
      );
    }

    return builder;
  }

  async getTotal({ search, isActive }: IUserSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      isActive,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    search,
    options,
    isActive,
  }: IUserSearch): Promise<User[]> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      isActive,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async removeUserBy(find: FindOptionsWhere<User>): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: find,
    });

    if (!findUser) {
      throw new UnprocessableEntityException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    // TODO remove profile image, when available

    return this.userRepository.remove(findUser);
  }

  async deleteUserBy(find: FindOptionsWhere<User>): Promise<DeleteResult> {
    const findUser = await this.userRepository.findOne({
      where: find,
    });

    if (!findUser) {
      throw new UnprocessableEntityException({
        statusCode: EnumUserStatusCodeError.UserNotFoundError,
        message: 'user.error.notFound',
      });
    }

    return this.userRepository.delete({ id: findUser.id });
  }

  async updateUserActiveStatus({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }): Promise<UpdateResult> {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ isActive })
      .where('id = :id', { id })
      .andWhere('isActive != :isActive', { isActive })
      .execute();
  }

  async serializationUserProfile(
    data: User,
  ): Promise<UserProfileGetSerialization> {
    return plainToInstance(UserProfileGetSerialization, data);
  }

  async serialization(data: User): Promise<UserGetSerialization> {
    return plainToInstance(UserGetSerialization, data);
  }

  async serializationList(data: User[]): Promise<UserGetSerialization[]> {
    return plainToInstance(UserGetSerialization, data);
  }
}
