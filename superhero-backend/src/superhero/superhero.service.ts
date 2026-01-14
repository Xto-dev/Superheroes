import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Superhero } from './entities/superhero.entity';
import { PaginatedSuperheroDto } from './dto/paginated-superhero.dto';

@Injectable()
export class SuperheroService {
  constructor(private prisma: PrismaService) {}
  
  async create(createSuperheroDto: CreateSuperheroDto): Promise<Superhero> {
    return await this.prisma.superhero.create({
      data: {
        nickname: createSuperheroDto.nickname,
        realName: createSuperheroDto.realName,
        originDescription: createSuperheroDto.originDescription,
        superpowers: createSuperheroDto.superpowers,
        catchPhrase: createSuperheroDto.catchPhrase,
        images: createSuperheroDto.images,
      },
    });
  }

  async findAll(): Promise<Superhero[]> {
    return await this.prisma.superhero.findMany();
  }

  async paginate(page: number, limit: number = 5): Promise<PaginatedSuperheroDto> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.superhero.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          nickname: true,
          images: true,
        },
      }),
      this.prisma.superhero.count(),
    ]);

    if (page > 1 && data.length === 0) {
      throw new BadRequestException('Page out of range');
    }

  const superheroes = data.map((superhero) => ({
    id: superhero.id,
    nickname: superhero.nickname,
    image: superhero.images[0] || ""
  }));

  return {
    data: superheroes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
  }

  async findOne(id: string): Promise<Superhero> {
    const superhero = await this.prisma.superhero.findUnique({
      where: { id },
    });

    if (!superhero) {
      throw new NotFoundException(`Superhero with ID ${id} not found`);
    }

    return superhero;
  }

  async update(id: string, updateSuperheroDto: UpdateSuperheroDto): Promise<Superhero> {
    await this.findOne(id);

    return this.prisma.superhero.update({
      where: { id },
      data: {
        ...(updateSuperheroDto.nickname && { nickname: updateSuperheroDto.nickname }),
        ...(updateSuperheroDto.realName && { realName: updateSuperheroDto.realName }),
        ...(updateSuperheroDto.originDescription && {
          originDescription: updateSuperheroDto.originDescription,
        }),
        ...(updateSuperheroDto.superpowers && {
          superpowers: updateSuperheroDto.superpowers,
        }),
        ...(updateSuperheroDto.catchPhrase && {
          catchPhrase: updateSuperheroDto.catchPhrase,
        }),
        ...(updateSuperheroDto.images !== undefined && {
          images: updateSuperheroDto.images,
        }),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.superhero.delete({
      where: { id },
    });
  }
}
