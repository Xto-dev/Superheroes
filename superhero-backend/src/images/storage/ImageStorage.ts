export abstract class ImageStorage {
  abstract save(buffer: Buffer, filename: string): Promise<void>;
  abstract delete(filename: string): Promise<void>;
  abstract getPublicUrl(filename: string): string;
}
