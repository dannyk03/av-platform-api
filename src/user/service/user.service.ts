import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumUserStatusCodeError } from '@avo/type';

import { isNumber } from 'class-validator';
import set from 'lodash/set';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { User } from '../entity';

import { IUserCheckExist, IUserSearch } from '../type/user.interface';
import { IAuthPassword } from '@/auth/type/auth.interface';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, ConnectionNames.Default)
    private userRepository: Repository<User>,
  ) {}

  async create(props: DeepPartial<User>): Promise<User> {
    return this.userRepository.create(props);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save<User>(user);
  }

  async findOne(find: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(find);
  }

  async find(find?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(find);
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
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ['authConfig'],
      select: {
        authConfig: {
          id: true,
        },
      },
    });

    set(user, 'authConfig.password', passwordHash);
    set(user, 'authConfig.passwordExpiredAt', passwordExpiredAt);
    set(user, 'authConfig.salt', salt);

    return this.userRepository.save(user);
  }

  async checkExistsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.findOne({
      where: { email },
    });

    return Boolean(exists);
  }

  async findUserByPhoneNumberForOtp({ phoneNumber }: { phoneNumber: string }) {
    return this.findOne({
      where: { phoneNumber },
      relations: {
        authConfig: true,
      },
      select: {
        id: true,
        phoneNumber: true,
        authConfig: {
          id: true,
          phoneVerifiedAt: true,
          user: {
            id: true,
          },
        },
      },
    });
  }

  async checkExist({
    email,
    phoneNumber,
  }: {
    email?: string;
    phoneNumber?: string;
  }): Promise<IUserCheckExist> {
    const existEmail = email && (await this.findOneBy({ email }));

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
}
