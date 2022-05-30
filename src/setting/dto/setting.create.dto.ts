import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { SafeString } from '@/utils/request/validation/request.safe-string.validation';
import { StringOrNumberOrBoolean } from '@/utils/request/validation/request.string-or-number-or-boolean.validation';

export class SettingCreateDto {
    @IsString()
    @IsNotEmpty()
    @SafeString()
    @Type(() => String)
    readonly name: string;

    @IsString()
    @IsOptional()
    @Type(() => String)
    @ValidateIf((e) => e.description !== '')
    readonly description?: string;

    @IsNotEmpty()
    @StringOrNumberOrBoolean()
    readonly value: string | boolean | number;
}
