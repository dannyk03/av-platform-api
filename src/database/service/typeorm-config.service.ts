import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConnectionNames } from '../database.constant';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(
    connectionName: ConnectionNames = ConnectionNames.Default,
  ): Promise<TypeOrmModuleOptions> {
    return this.configService.get(`database.${connectionName}`);
  }
}
