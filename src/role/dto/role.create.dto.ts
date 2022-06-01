import { Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsMongoId,
    IsEnum,
} from 'class-validator';
import { Roles } from '../role.constant';

export class RoleCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    readonly name: string;

    @IsEnum(Roles)
    @Type(() => String)
    readonly code: string;

    @IsMongoId({ each: true })
    @IsNotEmpty()
    readonly permissions: string[];
}
