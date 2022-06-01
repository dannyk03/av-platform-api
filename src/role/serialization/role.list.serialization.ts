import { Exclude, Type } from 'class-transformer';

export class RoleListSerialization {
    @Type(() => String)
    readonly _id: string;

    readonly isActive: boolean;
    readonly name: string;

    @Exclude()
    readonly permissions: number;

    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
