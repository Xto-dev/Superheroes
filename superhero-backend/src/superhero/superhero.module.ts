import { Module } from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { SuperheroController } from './superhero.controller';

@Module({
  controllers: [SuperheroController],
  providers: [SuperheroService],
})
export class SuperheroModule {}
