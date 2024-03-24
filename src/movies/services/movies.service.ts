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

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  public async create(createMovieDto: CreateMovieDto) {
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
    return await this.movieRepository.find({
      relations: ['genres'],
    });
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
}
