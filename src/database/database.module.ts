/* eslint @typescript-eslint/no-var-requires: "off" */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from 'src/movies/entities/genres.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { DataSourceOptions } from 'typeorm';

require('dotenv').config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: String(process.env.USERNAME),
  password: String(process.env.PASSWORD),
  database: String(process.env.DBNAME),
  entities: [Movie, Genre],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...dataSourceOptions,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
