import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImageStorage } from './storage/ImageStorage';
import { LocalImageStorageService } from './storage/LocalImageStorage';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ImagesController],
  providers: [
    ImagesService,
    PrismaService,
    {
      provide: ImageStorage,
      useClass: LocalImageStorageService,
    },
  ],
})
export class ImagesModule {}
