import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { OmdbModule } from './integrations/omdb/omdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MoviesModule,
    DatabaseModule,
    HttpModule,
    OmdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
