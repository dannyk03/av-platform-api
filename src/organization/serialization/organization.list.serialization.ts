import { Exclude } from 'class-transformer';

export class OrganizationListSerialization {
    readonly slug: string;
    readonly isActive: boolean;
    readonly name: string;
    readonly createdAt: Date;

    @Exclude()
    readonly updatedAt: Date;
}
