import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import dbConfiguration from '../../config/database.config';
import { ConnectionNames } from '../database.constant';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfiguration],
});

export default new DataSource(dbConfiguration()[ConnectionNames.Master]);
