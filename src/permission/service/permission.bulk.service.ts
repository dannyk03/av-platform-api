import { Injectable } from '@nestjs/common';
import { IPermissionCreate } from '../permission.interface';
import { PermissionEntity } from '../entity/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { Repository, In, DeleteResult } from 'typeorm';

@Injectable()
export class PermissionBulkService {
  constructor(
    @InjectRepository(PermissionEntity, ConnectionNames.Default)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createMany(data: IPermissionCreate[]): Promise<PermissionEntity[]> {
    const permissions = data.map((permission) =>
      this.permissionRepository.create(permission),
    );

    return this.permissionRepository.save(permissions);
  }

  async saveMany(data: PermissionEntity[]): Promise<PermissionEntity[]> {
    return this.permissionRepository.save(data);
  }

  async deleteManyBySlug(slugs: string[]): Promise<DeleteResult> {
    return this.permissionRepository.delete({ slug: In(slugs) });
  }
}
