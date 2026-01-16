import { Module } from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { SuperheroController } from './superhero.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesService } from 'src/images/images.service';
import { ImageStorage } from 'src/images/storage/ImageStorage';
import { LocalImageStorageService } from 'src/images/storage/LocalImageStorage';

@Module({
  controllers: [SuperheroController],
  providers: [
    SuperheroService,
    PrismaService,
    ImagesService,
    {
      provide: ImageStorage,
      useClass: LocalImageStorageService,
    },
  ],
})
export class SuperheroModule {}
