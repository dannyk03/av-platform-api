import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConnectionNames } from '../database.constant';
import { DataSourceOptions } from 'typeorm';
import { createDB } from '../utils';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createTypeOrmOptions(
    connectionName: ConnectionNames = ConnectionNames.Default,
  ): Promise<TypeOrmModuleOptions> {
    if (this.configService.get<boolean>('database.autoCreateDB')) {
      await createDB(
        this.configService.get<DataSourceOptions>(
          `database.${ConnectionNames.Default}`,
        ),
      );
    }
    return this.configService.get(`database.${connectionName}`);
  }
}
