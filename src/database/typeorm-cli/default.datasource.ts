import dbConfiguration from '../../config/database.config';
import { ConnectionNames } from '../database.constant';
import { ConfigDynamicModule } from '@/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource(
  ConfigDynamicModule &&
    (dbConfiguration()[ConnectionNames.Default] as DataSourceOptions),
);
