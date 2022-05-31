import { Exclude } from 'class-transformer';

export class OrganizationGetSerialization {
    readonly slug: string;

    readonly isActive: boolean;
    readonly name: string;

    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
