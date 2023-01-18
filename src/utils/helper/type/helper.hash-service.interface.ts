export interface IHelperHashService {
  randomSalt(length: number): string;

  bcrypt(passwordString: string, salt: string): string;

  bcryptCompare(passwordString: string, passwordHashed: string): boolean;

  sha256(string: string): string;

  sha256Compare(hashOne: string, hashTwo: string): boolean;

  sha1(string: string): string;

  sha1Compare(hashOne: string, hashTwo: string): boolean;

  nanoId(length?: number): Promise<string>;

  magicCode(): Promise<string>;

  easilyReadableCode(): Promise<string>;
}
