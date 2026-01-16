import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSuperheroDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  realName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  originDescription: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty()
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
  superpowers: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  catchPhrase: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images?: Express.Multer.File[];
}
