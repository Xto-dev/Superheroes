import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateSuperheroDto {
  @IsString()
  nickname: string;

  @IsString()
  realName: string;

  @IsString()
  originDescription: string;

  @IsArray()
  @IsString({ each: true })
  superpowers: string[];

  @IsString()
  catchPhrase: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];
}
