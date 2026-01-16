import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Superhero, Prisma } from '@prisma/client';

@Injectable()
export class SuperheroRepository {
  constructor(private prisma: PrismaService) {}

  // --- Create ---
  async create(data: Prisma.SuperheroCreateInput): Promise<Superhero> {
    return this.prisma.superhero.create({ data });
  }

  // --- Read ---
  async findAll(): Promise<Superhero[]> {
    return await this.prisma.superhero.findMany();
  }

  async findById(id: string) {
    return this.prisma.superhero.findUnique({
      where: { id },
      include: {
        superheroImages: {
          orderBy: { order: 'asc' },
          include: { image: true },
        },
      },
    });
  }

  async findPaginated(skip: number, take: number) {
    return this.prisma.superhero.findMany({
      skip,
      take,
      select: {
        id: true,
        nickname: true,
        superheroImages: {
          where: { order: 0 },
          select: { image: { select: { url: true } } },
          take: 1,
        },
      },
    });
  }

  async count(): Promise<number> {
    return this.prisma.superhero.count();
  }

  // --- Update ---
  async updateById(id: string, data: Prisma.SuperheroUpdateInput): Promise<Superhero> {
    return this.prisma.superhero.update({
      where: { id },
      data,
    });
  }

  // --- Delete ---
  async deleteById(id: string): Promise<Superhero> {
    return this.prisma.superhero.delete({
      where: { id },
    });
  }

  // --- Image Relations ---
  async deleteAllImageRelations(superheroId: string): Promise<void> {
    await this.prisma.superheroImage.deleteMany({
      where: { superheroId },
    });
  }

  async createImageRelation(data: Prisma.SuperheroImageCreateInput): Promise<void> {
    await this.prisma.superheroImage.create({ data });
  }

  async createImageRelations(relations: Prisma.SuperheroImageCreateInput[]): Promise<void> {
    await this.prisma.$transaction(
      relations.map((rel) => this.prisma.superheroImage.create({ data: rel }))
    );
  }
}
