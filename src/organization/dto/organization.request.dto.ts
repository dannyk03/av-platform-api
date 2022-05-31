import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class OrganizationGetDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    readonly slug: string;
}
