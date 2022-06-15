/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { AuthApi } from '../entity/auth.api.entity';
import { IDatabaseFindAllOptions } from 'src/database/database.interface';
import { plainToInstance } from 'class-transformer';
import { AuthApiListSerialization } from '../serialization/auth.api.list.serialization';
import { AuthApiGetSerialization } from '../serialization/auth.api.get.serialization';
import {
  IAuthApiEntity,
  IAuthApiRequestHashedData,
  IAuthApiCreate,
} from '../auth.interface';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { HelperHashService } from 'src/utils/helper/service/helper.hash.service';
import { AuthApiUpdateDto } from '../dto/auth.api.update.dto';
import { HelperEncryptionService } from 'src/utils/helper/service/helper.encryption.service';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthApiService {
  private readonly env: string;

  constructor(
    // @InjectRepository(AuthApi, ConnectionNames.Default)
    private authapiRepository: Repository<AuthApi>,
    private readonly helperStringService: HelperStringService,
    private readonly configService: ConfigService,
    private readonly helperHashService: HelperHashService,
    private readonly helperEncryptionService: HelperEncryptionService,
  ) {
    this.env = this.configService.get<string>('app.env');
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<AuthApi[] | any> {
    // const users = this.authapiRepository.find(find).select({
    //   name: 1,
    //   key: 1,
    //   isActive: 1,
    //   createdAt: 1,
    // });
    // if (options && options.limit !== undefined && options.skip !== undefined) {
    //   users.limit(options.limit).skip(options.skip);
    // }
    // if (options && options.sort) {
    //   users.sort(options.sort);
    // }
    // return users.lean();
  }

  async getTotal(find?: Record<string, any>): Promise<number | any> {
    // return this.authapiRepository.countDocuments(find);
  }

  async findOneById(id: string): Promise<AuthApi | any> {
    // return this.authapiRepository.findById(id).lean();
  }

  async findOne(find?: Record<string, any>): Promise<AuthApi | any> {
    // return this.authapiRepository.findOne(find).lean();
  }

  async findOneByKey(key: string): Promise<AuthApi | any> {
    // return this.authapiRepository.findOne({ key }).lean();
  }

  async serializationList(
    data: AuthApi[],
  ): Promise<AuthApiListSerialization[]> {
    return plainToInstance(AuthApiListSerialization, data);
  }

  async serializationGet(data: AuthApi): Promise<AuthApiGetSerialization> {
    return plainToInstance(AuthApiGetSerialization, data);
  }

  async inactive(id: string): Promise<AuthApi | any> {
    // const authApi: IAuthApiEntity = await this.authapiRepository.findById(id);
    // authApi.isActive = false;
    // return authApi.save();
  }

  async active(id: string): Promise<AuthApi | any> {
    // const authApi: IAuthApiEntity = await this.authapiRepository.findById(id);
    // authApi.isActive = true;
    // return authApi.save();
  }

  async create({
    name,
    description,
    key,
    secret,
    passphrase,
    encryptionKey,
  }: IAuthApiCreate): Promise<IAuthApiEntity | any> {
    key = key ? key : await this.createKey();
    secret = secret ? secret : await this.createSecret();
    passphrase = passphrase ? passphrase : await this.createPassphrase();
    encryptionKey = encryptionKey
      ? encryptionKey
      : await this.createEncryptionKey();
    const hash: string = await this.createHashApiKey(key, secret);

    // const create: IAuthApiEntity = new this.authapiRepository({
    //   name,
    //   description,
    //   key,
    //   hash,
    //   passphrase,
    //   encryptionKey,
    //   isActive: true,
    // });

    // await create.save();

    // return {
    //   id: create.id,
    //   secret,
    //   passphrase,
    //   encryptionKey,
    // };
  }

  async updateOneById(
    id: string,
    { name, description }: AuthApiUpdateDto,
  ): Promise<IAuthApiEntity | any> {
    // const authApi: IAuthApiEntity = await this.authapiRepository.findById(id);
    // authApi.name = name;
    // authApi.description = description;
    // return authApi.save();
  }

  async updateHashById(id: string): Promise<IAuthApiEntity | any> {
    // const authApi: IAuthApiEntity = await this.authapiRepository.findById(id);
    // const secret: string = await this.createSecret();
    // const hash: string = await this.createHashApiKey(authApi.key, secret);
    // const passphrase: string = await this.createPassphrase();
    // const encryptionKey: string = await this.createEncryptionKey();
    // authApi.hash = hash;
    // authApi.passphrase = passphrase;
    // authApi.encryptionKey = encryptionKey;
    // await authApi.save();
    // return {
    //   id: authApi.id,
    //   secret,
    //   passphrase,
    //   encryptionKey,
    // };
  }

  async deleteOneById(id: string): Promise<IAuthApiEntity | any> {
    // return this.authapiRepository.findByIdAndDelete(id);
  }

  async deleteOne(find: Record<string, any>): Promise<IAuthApiEntity | any> {
    // return this.authapiRepository.findOneAndDelete(find);
  }

  async createKey(): Promise<string> {
    return this.helperStringService.random(25, {
      safe: false,
      upperCase: true,
      prefix: this.env === 'production' ? 'production_' : 'development_',
    });
  }

  async createEncryptionKey(): Promise<string> {
    return this.helperStringService.random(15, {
      safe: false,
      upperCase: true,
      prefix: this.env === 'production' ? 'production_' : 'development_',
    });
  }

  async createSecret(): Promise<string> {
    return this.helperStringService.random(35, {
      safe: false,
      upperCase: true,
    });
  }

  async createPassphrase(): Promise<string> {
    return this.helperStringService.random(16, {
      safe: true,
    });
  }

  async createHashApiKey(key: string, secret: string): Promise<string> {
    return this.helperHashService.sha256(`${key}:${secret}`);
  }

  async validateHashApiKey(
    hashFromRequest: string,
    hash: string,
  ): Promise<boolean> {
    return this.helperHashService.sha256Compare(hashFromRequest, hash);
  }

  async decryptApiKey(
    apiKeyHashed: string,
    secretKey: string,
    passphrase: string,
  ): Promise<IAuthApiRequestHashedData> {
    const decrypted = this.helperEncryptionService.aes256Decrypt(
      apiKeyHashed,
      secretKey,
      passphrase,
    );

    return JSON.parse(decrypted);
  }

  async encryptApiKey(
    data: IAuthApiRequestHashedData,
    secretKey: string,
    passphrase: string,
  ): Promise<string> {
    return this.helperEncryptionService.aes256Encrypt(
      data,
      secretKey,
      passphrase,
    );
  }

  async createBasicToken(
    clientId: string,
    clientSecret: string,
  ): Promise<string> {
    const token = `${clientId}:${clientSecret}`;
    return this.helperEncryptionService.base64Decrypt(token);
  }

  async validateBasicToken(
    clientBasicToken: string,
    ourBasicToken: string,
  ): Promise<boolean> {
    return this.helperEncryptionService.base64Compare(
      clientBasicToken,
      ourBasicToken,
    );
  }
}
