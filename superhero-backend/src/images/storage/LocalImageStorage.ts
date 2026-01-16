// src/image/strategies/local-image-storage.service.ts
import { Injectable } from '@nestjs/common';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { ImageStorage } from './ImageStorage';

@Injectable()
export class LocalImageStorageService extends ImageStorage {
  private readonly uploadDir = join(process.cwd(), 'public', 'uploads');

  constructor() {
    super();
    import('fs').then(fs => {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    });
  }

  async save(buffer: Buffer, filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    await writeFile(filePath, buffer);
  }

  async delete(filename: string): Promise<void> {
    const filePath = join(this.uploadDir, filename);
    try {
        console.log(filePath);
      await unlink(filePath);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }

  getPublicUrl(filename: string): string {
    return `${process.env.APP_URL || 'http://localhost:5000'}/uploads/${filename}`;
  }
}