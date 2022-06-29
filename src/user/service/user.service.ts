import { Injectable } from '@nestjs/common';
import { IAuthPassword } from '@/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { User } from '../entity/user.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

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

  async createMany(props: DeepPartial<User>[]): Promise<User[]> {
    return this.userRepository.create(props);
  }

  async findOne(find: Record<string, any>): Promise<User> {
    return this.userRepository.findOne(find);
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
    { salt, passwordHash, passwordExpired }: IAuthPassword,
  ): Promise<User> {
    const user: User = await this.userRepository.findOneBy({ id });
    user.password = passwordHash;
    user.passwordExpired = passwordExpired;
    user.salt = salt;

    return this.userRepository.save(user);
  }

  async checkExistsByEmail(email: string): Promise<boolean> {
    const exists = await this.userRepository.findOne({
      where: { email },
    });

    return Boolean(exists);
  }
}
