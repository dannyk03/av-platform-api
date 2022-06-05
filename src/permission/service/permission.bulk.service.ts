import { Injectable } from '@nestjs/common';
import { IPermission } from '../permission.interface';
import { PermissionEntity } from '../entity/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionBulkService {
  constructor(
    @InjectRepository(PermissionEntity, ConnectionNames.Master)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createMany(data: IPermission[]): Promise<any | any[]> {
    // return this.permissionModel.insertMany(
    //   data.map(({ isActive, code, description, name }) => ({
    //     code: code,
    //     name: name,
    //     description: description,
    //     isActive: isActive || true,
    //   })),
    // );
  }

  async deleteMany(find: Record<string, any>): Promise<any> {
    // return this.permissionModel.deleteMany(find);
  }
}
