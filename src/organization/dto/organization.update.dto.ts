import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class OrganizationUpdateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly name: string;

    @IsBoolean()
    @IsOptional()
    readonly isActive?: boolean;
}
