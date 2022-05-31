import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/database';
import {
    OrganizationsCollectionName,
    OrganizationEntity,
    OrganizationSchema,
} from './schema/organization.schema';
import { OrganizationService } from './service/organization.service';
import { UserModule } from '@/user';

@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature(
            [
                {
                    name: OrganizationEntity.name,
                    schema: OrganizationSchema,
                    collection: OrganizationsCollectionName,
                },
            ],
            DATABASE_CONNECTION_NAME,
        ),
    ],
    exports: [OrganizationService],
    providers: [OrganizationService],
    controllers: [],
})
export class OrganizationModule {}
