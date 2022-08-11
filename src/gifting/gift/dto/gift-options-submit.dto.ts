import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class GiftOptionSubmitDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  giftOptionIds: string[];
}
