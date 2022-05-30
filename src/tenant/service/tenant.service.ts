import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { DatabaseEntity } from '@/database/database.decorator';
import { ITenantDocument } from '../tenant.interface';
import { TenantDocument, TenantEntity } from '../schema/tenant.schema';
import {
    IDatabaseFindAllOptions,
    //   IDatabaseFindOneOptions,
} from '@/database/database.interface';
import { TenantCreateDto } from '../dto/tenant.create.dto';
// import { TenantUpdateDto } from '../dto/tenant.update.dto';
import { TenantGetSerialization } from '../serialization/tenant.get.serialization';
import { TenantListSerialization } from '../serialization/tenant.list.serialization';

@Injectable()
export class TenantService {
    constructor(
        @DatabaseEntity(TenantEntity.name)
        private readonly tenantModel: Model<TenantDocument>,
    ) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions,
    ): Promise<TenantDocument[]> {
        const tenants = this.tenantModel.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            tenants.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            tenants.sort(options.sort);
        }

        return tenants.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.tenantModel.countDocuments(find);
    }

    async findOneBySlug<T>(slug: string): Promise<T> {
        const tenants = this.tenantModel.findOne({ slug });

        return tenants.lean();
    }

    async findOne<T>(find?: Record<string, any>): Promise<T> {
        const tenant = this.tenantModel.findOne(find);

        return tenant.lean();
    }

    async exists(name: string): Promise<boolean> {
        const exist = await this.tenantModel.exists({
            name: {
                $regex: new RegExp(name),
                $options: 'i',
            },
        });

        return exist ? true : false;
    }

    async create({ name }: TenantCreateDto): Promise<TenantDocument> {
        const create: TenantDocument = new this.tenantModel({
            name: name,
            isActive: true,
        });

        return create.save();
    }

    //   async update(
    //     slug: string,
    //     { name, isActive }: TenantUpdateDto,
    //   ): Promise<TenantDocument> {
    //     const update: TenantDocument = await this.tenantModel.findOne({ slug });
    //     update.name = name;
    //     update.permissions = permissions.map((val) => new Types.ObjectId(val));
    //     update.isAdmin = isAdmin || false;

    //     return update.save();
    //   }

    async inactive(slug: string): Promise<TenantDocument> {
        const tenant: TenantDocument = await this.tenantModel.findOne({ slug });

        tenant.isActive = false;
        return tenant.save();
    }

    async active(slug: string): Promise<TenantDocument> {
        const tenant: TenantDocument = await this.tenantModel.findOne({ slug });

        tenant.isActive = true;
        return tenant.save();
    }

    async deleteOneBySlug(slug: string): Promise<TenantDocument> {
        return this.tenantModel.findOneAndDelete({ slug });
    }

    async serializationGet(
        data: ITenantDocument,
    ): Promise<TenantGetSerialization> {
        return plainToInstance(TenantGetSerialization, data);
    }

    async serializationList(
        data: TenantDocument[],
    ): Promise<TenantListSerialization[]> {
        return plainToInstance(TenantListSerialization, data);
    }
}
