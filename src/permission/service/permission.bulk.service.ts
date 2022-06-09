import { Injectable } from '@nestjs/common';
import { IPermissionCreate } from '../permission.interface';
import { Permission } from '../entity/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { Repository, In, DeleteResult } from 'typeorm';

@Injectable()
export class PermissionBulkService {
  constructor(
    @InjectRepository(Permission, ConnectionNames.Default)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createMany(data: IPermissionCreate[]): Promise<Permission[]> {
    const permissions = data.map((permission) =>
      this.permissionRepository.create(permission),
    );

    return this.permissionRepository.save(permissions);
  }

  async saveMany(data: Permission[]): Promise<Permission[]> {
    return this.permissionRepository.save(data);
  }

  async deleteManyBySlug(slugs: string[]): Promise<DeleteResult> {
    return this.permissionRepository.delete({ slug: In(slugs) });
  }
}
