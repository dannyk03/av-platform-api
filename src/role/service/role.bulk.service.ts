import { Injectable } from '@nestjs/common';

import { RoleEntity } from '../entity/role.entity';
import { RoleCreateDto } from '../dto/role.create.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';

@Injectable()
export class RoleBulkService {
  constructor(
    @InjectRepository(RoleEntity, ConnectionNames.Default)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async deleteMany(find: Record<string, any>): Promise<any> {
    // return await this.roleRepository.deleteMany(find);
  }

  async createMany(data: RoleCreateDto[]): Promise<any[] | any> {
    // return this.roleRepository.insertMany(
    //   data.map(({ name, permissions, isAdmin }) => ({
    //     name,
    //     isActive: true,
    //     isAdmin: isAdmin || false,
    //     permissions: permissions.map((val) => new Types.ObjectId(val)),
    //   })),
    // );
  }
}
