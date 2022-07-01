import { DataSourceOptions } from 'typeorm';
import { createDatabase } from 'typeorm-extension';

export async function createDB(options: DataSourceOptions) {
  return createDatabase({
    ifNotExist: true,
    synchronize: options.synchronize,
    options: { ...options },
  });
}
