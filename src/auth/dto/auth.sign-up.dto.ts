import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { Allow, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';

import { SurveyPersonalDto } from '@/user/dto';

import { TrimTransform } from '@/utils/request/transform';
import { IsPasswordStrong } from '@/utils/request/validation';

export class AuthSignUpDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SurveyPersonalDto)
  @ApiProperty()
  readonly personal: SurveyPersonalDto;

  @Allow()
  @ApiProperty()
  readonly personas: object;

  @Allow()
  @ApiProperty()
  readonly dietary: object;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @TrimTransform()
  @ApiProperty({ required: false })
  @Type(() => String)
  readonly password!: string;
}
