import { ApiProperty } from '@nestjs/swagger';

export class SuperheroListItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  image: string;
}

export class PaginatedSuperheroDto {
  @ApiProperty({ type: [SuperheroListItem] })
  data: SuperheroListItem[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}