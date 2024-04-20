import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OmdbService {
  private readonly logger = new Logger(OmdbService.name);
  constructor(private httpService: HttpService) {}

  // Função para buscar filme pelo título
  async findMovieByTitle(title: string): Promise<any> {
    const apiKey = String(process.env.MY_API_KEY);
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURI(title)}`;
    const { data } = await firstValueFrom(
      await this.httpService.get<any[]>(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
