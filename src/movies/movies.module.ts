import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from './entities/genres.entity';
import { OmdbService } from 'src/integrations/omdb/omdb.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Genre]), HttpModule],
  controllers: [MoviesController],
  providers: [MoviesService, OmdbService],
  exports: [MoviesService],
})
export class MoviesModule {}
