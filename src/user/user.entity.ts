import { Report } from 'src/reports/report.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // Establish connection with Report entity
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
