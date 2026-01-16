import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Express.Multer.File[];
}
