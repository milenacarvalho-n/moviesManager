import { IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly year: string;
  @IsString()
  readonly duration: string;
  @IsString({ each: true })
  readonly genres: string[];
}
