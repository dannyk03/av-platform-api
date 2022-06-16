import { DataSource } from 'typeorm';
import dbConfiguration from '../../config/database.config';
import { ConnectionNames } from '../database.constant';
import { ConfigDynamicModule } from '@/config';

export default new DataSource(
  ConfigDynamicModule && dbConfiguration()[ConnectionNames.Default],
);
