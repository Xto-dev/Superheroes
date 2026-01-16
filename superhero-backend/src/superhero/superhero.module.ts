import { Module } from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { SuperheroController } from './superhero.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesService } from 'src/images/images.service';
import { ImageStorage } from 'src/images/storage/ImageStorage';
import { LocalImageStorageService } from 'src/images/storage/LocalImageStorage';
import { SuperheroRepository } from './superhero.repository';

@Module({
  controllers: [SuperheroController],
  providers: [
    PrismaService,
    SuperheroRepository,
    SuperheroService,
    ImagesService,
    {
      provide: ImageStorage,
      useClass: LocalImageStorageService,
    },
  ],
})
export class SuperheroModule {}
