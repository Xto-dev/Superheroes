import { IsInt, Min } from 'class-validator';

export class PaginateDto {
  @IsInt()
  @Min(1)
  page: number;
}
