import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/database/database.constant';
import {
    TenantsCollectionName,
    TenantEntity,
    TenantSchema,
} from './schema/tenant.schema';
import { TenantService } from './service/tenant.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: TenantEntity.name,
                    schema: TenantSchema,
                    collection: TenantsCollectionName,
                },
            ],
            DATABASE_CONNECTION_NAME,
        ),
    ],
    exports: [TenantService],
    providers: [TenantService],
    controllers: [],
})
export class TenantModule {}
