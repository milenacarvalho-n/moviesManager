import { randomUUID } from 'node:crypto';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genres.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  duration: string;

  @Column()
  year: string;

  @JoinTable()
  @ManyToMany(() => Genre, (genre) => genre.movies, {
    cascade: true,
  })
  genres: Genre[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @BeforeInsert()
  generatedID() {
    if (this.id) {
      return;
    }
    this.id = randomUUID();
  }
}
