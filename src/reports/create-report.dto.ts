import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Url cannot be empty' })
  url: string;
}
