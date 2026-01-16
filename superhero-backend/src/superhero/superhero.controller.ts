import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';

@Controller('superhero')
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async create(
    @Body() createSuperheroDto: CreateSuperheroDto,
    @UploadedFiles() uploadedFiles?: { images?: Express.Multer.File[] }
  ) {
    return await this.superheroService.create(createSuperheroDto, uploadedFiles?.images);
  }

  @Get('/all')
  async findAll() {
    return await this.superheroService.findAll();
  }

  @Get()
  @ApiQuery({ name: 'page', required: true, description: 'The page number of the heroes' })
  async paginate(@Query() query: Record<string, any>) {
    return await this.superheroService.paginate(query.page);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.superheroService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSuperheroDto: UpdateSuperheroDto,
    @UploadedFiles() uploadedFiles?: { images?: Express.Multer.File[] }
  ) {
    return await this.superheroService.update(id, updateSuperheroDto, uploadedFiles?.images);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.superheroService.remove(id);
  }
}
