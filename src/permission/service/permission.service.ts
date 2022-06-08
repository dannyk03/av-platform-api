import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PermissionUpdateDto } from '../dto/permission.update.dto';
import { IPermission } from '../permission.interface';
import { PermissionEntity } from '../entity/permission.entity';
import { PermissionGetSerialization } from '../serialization/permission.get.serialization';
import { PermissionListSerialization } from '../serialization/permission.list.serialization';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { IDatabaseFindAllOptions } from '@/database/database.interface';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity, ConnectionNames.Default)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findAll(
    find?: FindManyOptions<PermissionEntity>,
  ): Promise<PermissionEntity[]> {
    return this.permissionRepository.find(find);
  }

  // async findAllBySlug(
  //   slugs: FindManyOptions<PermissionEntity>,
  // ): Promise<PermissionEntity[]> {
  //   return this.permissionRepository.find(find);
  // }

  createPermissionEntity(
    permission: Partial<PermissionEntity>,
  ): PermissionEntity {
    return this.permissionRepository.create(permission);
  }

  async findOneById(id: string): Promise<any> {
    // return this.permissionModel.findById(id).lean();
  }

  async findOne(find?: Record<string, any>): Promise<any> {
    // return this.permissionModel.findOne(find).lean();
  }

  async getTotal(find?: Record<string, any>): Promise<any> {
    // return this.permissionModel.countDocuments(find);
  }

  async deleteOne(find: Record<string, any>): Promise<any> {
    // return this.permissionModel.findOneAndDelete(find);
  }

  async create(data: IPermission): Promise<any> {
    // const create: PermissionDocument = new this.permissionModel({
    //   name: data.name,
    //   code: data.code,
    //   description: data.description,
    //   isActive: data.isActive || true,
    // });
    // return create.save();
  }

  async update(
    id: string,
    { name, description }: PermissionUpdateDto,
  ): Promise<any> {
    // const permission = await this.permissionModel.findById(id);
    // permission.name = name;
    // permission.description = description;
    // return permission.save();
  }

  async serializationGet(
    data: PermissionEntity,
  ): Promise<PermissionGetSerialization> {
    return plainToInstance(PermissionGetSerialization, data);
  }

  async serializationList(
    data: PermissionEntity[],
  ): Promise<PermissionListSerialization[]> {
    return plainToInstance(PermissionListSerialization, data);
  }

  async inactive(id: string): Promise<any> {
    // const permission: PermissionDocument = await this.permissionModel.findById(
    //   id,
    // );
    // permission.isActive = false;
    // return permission.save();
  }

  async active(id: string): Promise<any> {
    // const permission: PermissionDocument = await this.permissionModel.findById(
    //   id,
    // );
    // permission.isActive = true;
    // return permission.save();
  }
}
