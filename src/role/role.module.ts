import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '@/database';
import { RoleDatabaseName, RoleEntity, RoleSchema } from './schema/role.schema';
import { RoleBulkService } from './service/role.bulk.service';
import { RoleService } from './service/role.service';

@Module({
    controllers: [],
    providers: [RoleService, RoleBulkService],
    exports: [RoleService, RoleBulkService],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: RoleEntity.name,
                    schema: RoleSchema,
                    collection: RoleDatabaseName,
                },
            ],
            DATABASE_CONNECTION_NAME,
        ),
    ],
})
export class RoleModule {}