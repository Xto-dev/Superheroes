import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { PaginatedSuperheroDto } from './dto/paginated-superhero.dto';
import { ImagesService } from 'src/images/images.service';
import { SuperheroRepository } from './superhero.repository';
import { SuperheroResponseDto } from './dto/rsponse-superhero.dto';
import { Image } from '@prisma/client';

@Injectable()
export class SuperheroService {
  constructor(
    private superheroRepo: SuperheroRepository,
    private imagesService: ImagesService
  ) {}

  async create(
    dto: CreateSuperheroDto,
    files?: Express.Multer.File[]
  ): Promise<SuperheroResponseDto> {
    const superhero = await this.superheroRepo.create({
      nickname: dto.nickname,
      realName: dto.realName,
      originDescription: dto.originDescription,
      superpowers: dto.superpowers,
      catchPhrase: dto.catchPhrase,
    });

    if (files?.length) {
      const savedImages = await this.imagesService.create(files);
      await this.superheroRepo.createImageRelations(
        savedImages!.map((img, index) => ({
          superhero: { connect: { id: superhero.id } },
          image: { connect: { id: img.id } },
          order: index,
        }))
      );
    }

    return this.findOne(superhero.id);
  }

  async findAll() {
    return this.superheroRepo.findAll();
  }

  async paginate(page: number, limit = 5): Promise<PaginatedSuperheroDto> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.superheroRepo.findPaginated(skip, limit),
      this.superheroRepo.count(),
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

  async findOne(id: string): Promise<SuperheroResponseDto> {
    const hero = await this.superheroRepo.findById(id);
    if (!hero) throw new NotFoundException(`Superhero ${id} not found`);

    const images = hero.superheroImages?.map((si) => si.image.url) || [];

    return {
      id: hero.id,
      nickname: hero.nickname,
      realName: hero.realName,
      originDescription: hero.originDescription,
      superpowers: hero.superpowers,
      catchPhrase: hero.catchPhrase,
      images: images,
    };
  }

  async update(
    id: string,
    dto: UpdateSuperheroDto,
    files?: Express.Multer.File[]
  ): Promise<SuperheroResponseDto> {
    await this.findOne(id);

    const updatedHero = await this.superheroRepo.updateById(id, {
      ...(dto.nickname !== undefined && { nickname: dto.nickname }),
      ...(dto.realName !== undefined && { realName: dto.realName }),
      ...(dto.originDescription !== undefined && { originDescription: dto.originDescription }),
      ...(dto.superpowers !== undefined && { superpowers: dto.superpowers }),
      ...(dto.catchPhrase !== undefined && { catchPhrase: dto.catchPhrase }),
    });

    await this.superheroRepo.deleteAllImageRelations(id);
    const existedImages = await Promise.all(
      (dto.existedImages ?? []).map(async (url) => {
        return await this.imagesService.findOneByUrl(url);
      })
    );
    const savedImages = await this.imagesService.create(files);

    const orderedImages = (dto.imageOrder ?? [])
      .map((image) => {
        return (
          existedImages.find((eImage) => eImage.url === image) ||
          savedImages?.find((sImage) => sImage.filename === image)
        );
      })
      .filter(Boolean);

    await this.superheroRepo.createImageRelations(
      orderedImages.map((img, index) => ({
        superhero: { connect: { id } },
        image: { connect: { id: img!.id } },
        order: index,
      }))
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.superheroRepo.deleteById(id);
  }
}
