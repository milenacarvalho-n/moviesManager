import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly year?: string;

  @IsString()
  @IsOptional()
  readonly duration?: string;

  @IsString({ each: true })
  @IsOptional()
  readonly genres?: string[];
}
