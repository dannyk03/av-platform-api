import { Injectable } from '@nestjs/common';

import { Role } from '../entity/role.entity';
import { RoleCreateDto } from '../dto/role.create.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';

@Injectable()
export class RoleBulkService {
  constructor(
    @InjectRepository(Role, ConnectionNames.Default)
    private roleRepository: Repository<Role>,
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
