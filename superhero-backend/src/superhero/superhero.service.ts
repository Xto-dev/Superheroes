import { Injectable } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Injectable()
export class SuperheroService {
  create(createSuperheroDto: CreateSuperheroDto) {
    return 'This action adds a new superhero';
  }

  findAll() {
    return `This action returns all superhero`;
  }

  paginate(page: number)
  {
    return `This action return pagination of superheroes. Page: ${page}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} superhero`;
  }

  update(id: number, updateSuperheroDto: UpdateSuperheroDto) {
    return `This action updates a #${id} superhero`;
  }

  remove(id: number) {
    return `This action removes a #${id} superhero`;
  }
}
