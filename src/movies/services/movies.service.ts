import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genres.entity';
import { OmdbService } from 'src/integrations/omdb/omdb.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly omdbService: OmdbService,
  ) {}

  public async create(createMovieDto: CreateMovieDto) {
    const validation = await this.preloadMovieByName(createMovieDto.title);
    if (validation) {
      throw new HttpException(
        `movie with title: ${createMovieDto.title} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const genres = await Promise.all(
      createMovieDto.genres.map((name) => this.preloadGenreByName(name)),
    );

    const movie = this.movieRepository.create({
      ...createMovieDto,
      genres,
    });

    return this.movieRepository.save(movie);
  }

  public async findAll() {
    const movies = await this.movieRepository.find({
      relations: ['genres'],
    });
    const data = [];
    for (const movie of movies) {
      const res = await this.preloadMovieImages(movie.title);

      if (res.Response === 'False') {
        const { genres, ...rest } = movie;
        data.push({
          ...rest,
          genres: genres.map((genre) => genre.name),
          imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
        });
      } else {
        const { genres, ...rest } = movie;
        data.push({
          ...rest,
          genres: genres.map((genre) => genre.name),
          imageUrl: res.Poster,
        });
      }
    }
    return data;
  }

  public async findOne(id: string) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genres'],
    });
    if (!movie) {
      throw new HttpException(
        `movie with ID: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return movie;
  }

  public async update(id: string, updateMovieDto: UpdateMovieDto) {
    const genres =
      updateMovieDto.genres &&
      (await Promise.all(
        updateMovieDto.genres.map((name) => this.preloadGenreByName(name)),
      ));

    const course = await this.movieRepository.preload({
      ...updateMovieDto,
      id,
      genres,
    });

    if (!course) {
      throw new NotFoundException(`Movie ID ${id} not found`);
    }
    return this.movieRepository.save(course);
  }

  public async remove(id: string) {
    const movie = await this.movieRepository.findOne({
      where: { id },
    });
    if (!movie) {
      throw new NotFoundException(`movie ID ${id} not found`);
    }
    return this.movieRepository.remove(movie);
  }

  private async preloadGenreByName(name: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { name } });
    if (genre) {
      return genre;
    }
    return this.genreRepository.create({ name });
  }

  private async preloadMovieByName(title: string): Promise<boolean> {
    const movie = await this.movieRepository.findOne({ where: { title } });
    if (movie) {
      return true;
    }
    return false;
  }

  private async preloadMovieImages(titleMovie: string): Promise<any> {
    return await this.omdbService.findMovieByTitle(titleMovie);
  }
}
