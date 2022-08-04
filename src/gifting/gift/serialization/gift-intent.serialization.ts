import { Exclude, Expose } from 'class-transformer';

// @Exclude()
export class GiftIntentSerialization {}

@Exclude()
export class GiftRecipientSerialization {}

@Exclude()
export class GiftSenderSerialization {}
