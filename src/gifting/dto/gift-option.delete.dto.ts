import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class GiftOptionDeleteDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  giftOptionIds: string[];
}
