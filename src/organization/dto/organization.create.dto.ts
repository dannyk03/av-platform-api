import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class OrganizationCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly name: string;
}
