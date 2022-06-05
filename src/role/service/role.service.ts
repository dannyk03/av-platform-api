import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RoleEntity } from '../entity/role.entity';
import { IDatabaseFindAllOptions } from 'src/database/database.interface';
import { RoleCreateDto } from '../dto/role.create.dto';
import { RoleUpdateDto } from '../dto/role.update.dto';
import { RoleGetSerialization } from '../serialization/role.get.serialization';
import { RoleListSerialization } from '../serialization/role.list.serialization';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionNames } from '@/database';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity, ConnectionNames.Master)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<any[] | any> {
    // const roles = this.roleRepository.find(find);
    // if (options && options.limit !== undefined && options.skip !== undefined) {
    //   roles.limit(options.limit).skip(options.skip);
    // }
    // if (options && options.sort) {
    //   roles.sort(options.sort);
    // }
    // return roles.lean();
  }

  async getTotal(find?: Record<string, any>): Promise<number | any> {
    // return this.roleRepository.countDocuments(find);
  }

  async findOneById<T>(_id: string, options?): Promise<any> {
    // const roles = this.roleRepository.findById(_id);
    // if (options && options.populate && options.populate.permission) {
    //   roles.populate({
    //     path: 'permissions',
    //     model: PermissionEntity.name,
    //   });
    // }
    // return roles.lean();
  }

  async findOne<T>(find?: Record<string, any>, options?): Promise<any> {
    // const role = this.roleRepository.findOne(find);
    // if (options && options.populate && options.populate.permission) {
    //   role.populate({
    //     path: 'permissions',
    //     model: PermissionEntity.name,
    //   });
    // }
    // return role.lean();
  }

  async exists(name: string, _id?: string): Promise<boolean> {
    // const exist = await this.roleRepository.exists({
    //   name: {
    //     $regex: new RegExp(name),
    //     $options: 'i',
    //   },
    //   _id: { $nin: new Types.ObjectId(_id) },
    // });

    // return exist ? true : false;
    return false;
  }

  async create({ name, permissions, isAdmin }: RoleCreateDto): Promise<any> {
    // const create: RoleDocument = new this.roleRepository({
    //   name,
    //   permissions: permissions.map((val) => new Types.ObjectId(val)),
    //   isActive: true,
    //   isAdmin: isAdmin || false,
    // });
    // return create.save();
  }

  async update(
    _id: string,
    { name, permissions, isAdmin }: RoleUpdateDto,
  ): Promise<any> {
    // const update: RoleDocument = await this.roleRepository.findById(_id);
    // update.name = name;
    // update.permissions = permissions.map((val) => new Types.ObjectId(val));
    // update.isAdmin = isAdmin || false;
    // return update.save();
  }

  async inactive(_id: string): Promise<any> {
    // const role: RoleDocument = await this.roleRepository.findById(_id);
    // role.isActive = false;
    // return role.save();
  }

  async active(_id: string): Promise<any> {
    // const role: RoleDocument = await this.roleRepository.findById(_id);
    // role.isActive = true;
    // return role.save();
  }

  async deleteOneById(_id: string): Promise<any> {
    // return this.roleRepository.findByIdAndDelete(_id);
  }

  async serializationGet(data): Promise<RoleGetSerialization> {
    return plainToInstance(RoleGetSerialization, data);
  }

  async serializationList(
    data: RoleEntity[],
  ): Promise<RoleListSerialization[]> {
    return plainToInstance(RoleListSerialization, data);
  }
}
