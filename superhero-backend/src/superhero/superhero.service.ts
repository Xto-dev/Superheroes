import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedSuperheroDto } from './dto/paginated-superhero.dto';
import { ImagesService } from 'src/images/images.service';
import { Superhero } from '@prisma/client';

@Injectable()
export class SuperheroService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService
  ) {}

  async create(createSuperheroDto: CreateSuperheroDto, files?: Express.Multer.File[]) {
    const superhero = await this.prisma.superhero.create({
      data: {
        nickname: createSuperheroDto.nickname,
        realName: createSuperheroDto.realName,
        originDescription: createSuperheroDto.originDescription,
        superpowers: createSuperheroDto.superpowers,
        catchPhrase: createSuperheroDto.catchPhrase,
      },
    });

    if (files && files.length > 0) {
      const savedImages = await this.imagesService.create(files);

      await this.prisma.$transaction(
        savedImages!.map((img, index) =>
          this.prisma.superheroImage.create({
            data: {
              superheroId: superhero.id,
              imageId: img.id,
              order: index,
            },
          })
        )
      );
    }

    return await this.findOne(superhero.id);
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
          superheroImages: {
            where: { order: 0 },
            select: { image: { select: { url: true } } },
            take: 1,
          },
        },
      }),
      this.prisma.superhero.count(),
    ]);

    if (page > 1 && data.length === 0) {
      throw new BadRequestException('Page out of range');
    }

    const superheroes = data.map((hero) => ({
      id: hero.id,
      nickname: hero.nickname,
      image: hero.superheroImages[0]?.image.url || '',
    }));

    return {
      data: superheroes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const hero = await this.prisma.superhero.findUnique({
      where: { id },
      include: {
        superheroImages: {
          orderBy: { order: 'asc' },
          include: { image: true },
        },
      },
    });

    if (!hero) throw new NotFoundException(`Superhero ${id} not found`);

    return {
      ...hero,
      images: hero.superheroImages.map((si) => si.image.url),
    };
  }

  async update(id: string, dto: UpdateSuperheroDto, files?: Express.Multer.File[]) {
    await this.findOne(id);

    const updatedHero = await this.prisma.superhero.update({
      where: { id },
      data: {
        ...(dto.nickname !== undefined && { nickname: dto.nickname }),
        ...(dto.realName !== undefined && { realName: dto.realName }),
        ...(dto.originDescription !== undefined && { originDescription: dto.originDescription }),
        ...(dto.superpowers !== undefined && { superpowers: dto.superpowers }),
        ...(dto.catchPhrase !== undefined && { catchPhrase: dto.catchPhrase }),
      },
    });

    if (files) {
      await this.prisma.superheroImage.deleteMany({ where: { superheroId: id } });

      if (files.length > 0) {
        const savedImages = await this.imagesService.create(files);

        await this.prisma.$transaction(
          savedImages!.map((img, index) =>
            this.prisma.superheroImage.create({
              data: {
                superheroId: id,
                imageId: img.id,
                order: index,
              },
            })
          )
        );
      }
    }
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.superhero.delete({
      where: { id },
    });
  }
}
