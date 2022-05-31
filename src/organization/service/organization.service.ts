import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { DatabaseEntity } from '@/database';
import { IOrganizationDocument } from '../organization.interface';
import {
    OrganizationDocument,
    OrganizationEntity,
} from '../schema/organization.schema';
import { UserService } from '@/user';
import { IDatabaseFindAllOptions, IDatabaseFindOneOptions } from '@/database';
import { OrganizationCreateDto } from '../dto/organization.create.dto';
import { OrganizationUpdateDto } from '../dto/organization.update.dto';
import { OrganizationGetSerialization } from '../serialization/organization.get.serialization';
import { OrganizationListSerialization } from '../serialization/organization.list.serialization';

@Injectable()
export class OrganizationService {
    constructor(
        @DatabaseEntity(OrganizationEntity.name)
        private readonly organizationModel: Model<OrganizationDocument>,
        private readonly userService: UserService,
    ) {}

    async findAll(
        find?: Record<string, any>,
        options?: IDatabaseFindAllOptions,
    ): Promise<OrganizationDocument[]> {
        const organizations = this.organizationModel.find(find);
        if (
            options &&
            options.limit !== undefined &&
            options.skip !== undefined
        ) {
            organizations.limit(options.limit).skip(options.skip);
        }

        if (options && options.sort) {
            organizations.sort(options.sort);
        }

        return organizations.lean();
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return this.organizationModel.countDocuments(find);
    }

    async findOneBySlug<T>(slug: string): Promise<T> {
        const organizations = this.organizationModel.findOne({ slug });

        return organizations.lean();
    }

    async findOne<T>(find?: Record<string, any>): Promise<T> {
        const organization = this.organizationModel.findOne(find);

        return organization.lean();
    }

    async exists(slug: string): Promise<boolean> {
        const exist = await this.organizationModel.exists({
            slug: {
                $regex: new RegExp(slug),
                $options: 'i',
            },
        });

        return Boolean(exist);
    }

    async create({
        name,
        ownerEmail,
    }: OrganizationCreateDto): Promise<OrganizationDocument> {
        const create: OrganizationDocument = new this.organizationModel({
            name: name,
            owners: [],
        });

        return create.save();
    }

    // async update(
    //     slug: string,
    //     { name, isActive }: OrganizationUpdateDto,
    // ): Promise<OrganizationDocument> {
    //     const update: OrganizationDocument =
    //         await this.organizationModel.findOne({
    //             slug,
    //         });
    //     update.name = name;

    //     if (name) {
    //         update.name = name;
    //     }
    //     if (typeof isActive !== 'undefined') {
    //         update.isActive = isActive;
    //     }
    //     return update.save();
    // }

    // async inactive(slug: string): Promise<OrganizationDocument> {
    //     const organization: OrganizationDocument =
    //         await this.organizationModel.findOne({
    //             slug,
    //         });

    //     organization.isActive = false;
    //     return organization.save();
    // }

    // async active(slug: string): Promise<OrganizationDocument> {
    //     const organization: OrganizationDocument =
    //         await this.organizationModel.findOne({
    //             slug,
    //         });

    //     organization.isActive = true;
    //     return organization.save();
    // }

    // async deleteOneBySlug(slug: string): Promise<OrganizationDocument> {
    //     return this.organizationModel.findOneAndDelete({ slug });
    // }

    // async serializationGet(
    //     data: IOrganizationDocument,
    // ): Promise<OrganizationGetSerialization> {
    //     return plainToInstance(OrganizationGetSerialization, data);
    // }

    // async serializationList(
    //     data: OrganizationDocument[],
    // ): Promise<OrganizationListSerialization[]> {
    //     return plainToInstance(OrganizationListSerialization, data);
    // }
}
