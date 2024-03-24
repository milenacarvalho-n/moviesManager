import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database.module';

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: true,
});
