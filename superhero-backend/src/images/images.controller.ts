import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }]))
  @ApiBody({
    description: 'List of images',
    type: CreateImageDto,
  })
  async create(@UploadedFiles() uploadedFiles?: { images?: Express.Multer.File[] }) {
    return await this.imagesService.create(uploadedFiles?.images);
  }

  @Get()
  getAll() {
    return this.imagesService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
