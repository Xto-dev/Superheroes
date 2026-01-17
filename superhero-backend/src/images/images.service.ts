import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageStorage } from './storage/ImageStorage';
import * as crypto from 'crypto';

@Injectable()
export class ImagesService {
  constructor(
    private prisma: PrismaService,
    private storage: ImageStorage
  ) {}

  async create(images?: Express.Multer.File[]) {
    if (!images) return;

    var savedImages = await Promise.all(
      images.map(async (image) => {
        const hash = this.calculateFileHash(image.buffer);
        const existing = await this.prisma.image.findUnique({ where: { hash } });
        if (existing) return existing;

        await this.storage.save(image.buffer, image.originalname);
        return await this.prisma.image.create({
          data: {
            hash: hash,
            filename: image.originalname,
            url: this.storage.getPublicUrl(image.originalname),
          },
        });
      })
    );
    return savedImages;
  }

  getAll() {
    return this.prisma.image.findMany();
  }

  async findOne(id: string) {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return image;
  }

  async findOneByUrl(url: string) {
    const image = await this.prisma.image.findFirst({
      where: { url },
    });

    if (!image) {
      throw new NotFoundException(`Image with url: ${url} - not found`);
    }

    return image;
  }

  async remove(id: string) {
    const image = await this.findOne(id);

    await this.storage.delete(image.filename);
    await this.prisma.image.delete({
      where: { id },
    });
  }

  private calculateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
