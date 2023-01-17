import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumUserStatusCodeError } from '@avo/type';

import { isDefined, isNumber } from 'class-validator';
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

import { HelperStringService } from '@/utils/helper/service';

import { IUserCheckExist, IUserSearch } from '../type/user.interface';
import { IAuthPassword } from '@/auth/type/auth.interface';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, ConnectionNames.Default)
    private readonly userRepository: Repository<User>,
    private readonly helperStringService: HelperStringService,
  ) {}

  async create(props: DeepPartial<User>): Promise<User> {
    return this.userRepository.create(props);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save<User>(user);
  }

  async saveBulk(data: User[]): Promise<User[]> {
    return this.userRepository.save<User>(data);
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
      select: {
        id: true,
        email: true,
      },
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
    const findUser =
      email || phoneNumber
        ? await this.findOne({
            where: [
              {
                phoneNumber,
              },
              {
                email,
              },
            ],
            select: {
              id: true,
              email: true,
              phoneNumber: true,
              isActive: true,
            },
          })
        : null;

    return {
      email: isDefined(findUser?.email) && findUser?.email === email,
      phoneNumber:
        isDefined(findUser?.phoneNumber) &&
        findUser?.phoneNumber === phoneNumber,
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
      const formattedSearch = this.helperStringService.tsQueryParam(search);
      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `to_tsvector('english', CONCAT_WS(' ', user.email, profile.firstName, profile.lastName, user.phoneNumber)) @@ to_tsquery('english', :search)`,
            { search: `${formattedSearch}` },
          );
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

  async getUserSearchGroupBuilder({
    search,
  }: IUserSearch): Promise<SelectQueryBuilder<User>> {
    const builder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (search) {
      const formattedSearch = this.helperStringService.tsQueryParam(search);
      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `to_tsvector('english', CONCAT_WS(' ', user.email, profile.firstName, profile.lastName)) @@ to_tsquery('english', :search)`,
            { search: `${formattedSearch}` },
          );
        }),
      );
    }

    return builder;
  }

  async paginatedSearchForGroup({
    search,
    options,
  }: IUserSearch): Promise<User[]> {
    const searchBuilder = await this.getUserSearchGroupBuilder({
      search,
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

  async getAllUsersQueryBuilder(): Promise<SelectQueryBuilder<User>> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('profile.company', 'company')
      .leftJoinAndSelect('profile.shipping', 'shipping')
      .leftJoinAndSelect('profile.home', 'home');

    return qb;
  }
}
