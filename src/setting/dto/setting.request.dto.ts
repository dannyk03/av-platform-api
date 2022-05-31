import { Type } from 'class-transformer';
import { IsNotEmpty, IsMongoId } from 'class-validator';

export class SettingGetDto {
    @IsNotEmpty()
    @IsMongoId()
    @Type(() => String)
    setting: string;
}
