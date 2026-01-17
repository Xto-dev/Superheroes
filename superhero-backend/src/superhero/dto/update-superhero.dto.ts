import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ImageItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: Express.Multer.File;
}

export class UpdateSuperheroDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  realName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  originDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  catchPhrase?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string')
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  })
  superpowers?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string')
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  })
  existedImages?: string[];

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  images?: Express.Multer.File[];

  @ApiProperty({
    type: [String],
    description: 'Order of all images: URLs for existed, filenames for new',
    example: ['http://localhost:5000/uploads/img1.jpg', 'spider2.png'],
  })
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string')
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  })
  imageOrder?: string[];
}
