import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConnectionNames } from '../database.constant';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    connectionName: ConnectionNames = ConnectionNames.Default,
  ): TypeOrmModuleOptions {
    return this.configService.get(`database.${connectionName}`);
  }
}
