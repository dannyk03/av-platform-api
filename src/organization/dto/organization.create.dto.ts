import {
    IsString,
    IsNotEmpty,
    MaxLength,
    MinLength,
    IsOptional,
    IsEmail,
} from 'class-validator';

export class OrganizationCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @IsEmail()
    readonly ownerEmail?: string;
}
