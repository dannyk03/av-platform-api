import { DataSource, DataSourceOptions } from 'typeorm';

import { ConnectionNames } from '@/database/constant/database.constant';

import { ConfigDynamicModule } from '@/config';
import dbConfiguration from '@/config/database.config';

export default new DataSource(
  ConfigDynamicModule &&
    (dbConfiguration()[ConnectionNames.Default] as DataSourceOptions),
);
