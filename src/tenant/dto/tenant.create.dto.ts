import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class TenantCreateDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    @Type(() => String)
    readonly name: string;
}
