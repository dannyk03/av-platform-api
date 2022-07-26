import { ConfigDynamicModule } from '$/config';
import dbConfiguration from '$/config/database.config';
import { ConnectionNames } from '$/database/database.constant';
import { DataSource, DataSourceOptions } from 'typeorm';

export default new DataSource(
  ConfigDynamicModule &&
    (dbConfiguration()[ConnectionNames.Default] as DataSourceOptions),
);
