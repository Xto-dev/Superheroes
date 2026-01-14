import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

@Controller('superhero')
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Post()
  create(@Body(ValidationPipe) createSuperheroDto: CreateSuperheroDto) {
    return this.superheroService.create(createSuperheroDto);
  }

  @Get()
  findAll() {
    return this.superheroService.findAll();
  }

  @Get(':page')
  paginate(@Param('page', ParseIntPipe) page: number)
  {
    return this.superheroService.paginate(page);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.superheroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateSuperheroDto: UpdateSuperheroDto) {
    return this.superheroService.update(+id, updateSuperheroDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.superheroService.remove(+id);
  }
}
