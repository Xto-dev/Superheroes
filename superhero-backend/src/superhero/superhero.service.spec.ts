import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroService } from './superhero.service';
import { SuperheroRepository } from './superhero.repository';
import { ImagesService } from '../images/images.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';

describe('SuperheroService', () => {
  let service: SuperheroService;
  let mockRepository: jest.Mocked<SuperheroRepository>;
  let mockImagesService: jest.Mocked<ImagesService>;

  // ==================== Test Data Factory ====================
  const createMockSuperhero = (overrides?: Partial<any>) => ({
    id: '1',
    nickname: 'Iron Man',
    realName: 'Tony Stark',
    originDescription: 'Genius billionaire',
    superpowers: ['Tech'],
    catchPhrase: 'I am Iron Man',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    superheroImages: [],
    ...overrides,
  });

  const createMockImage = (overrides?: Partial<any>) => ({
    id: 'img1',
    createdAt: new Date('2024-01-01'),
    hash: 'abc123hash',
    filename: 'ironman.jpg',
    url: 'http://example.com/ironman.jpg',
    ...overrides,
  });

  const createMockSuperheroWithImages = (imageCount = 1) => {
    const image = createMockImage();
    return createMockSuperhero({
      superheroImages: Array(imageCount)
        .fill(null)
        .map(() => ({ image })),
    });
  };

  const createMultipleMockSuperheroes = (count = 2) =>
    Array(count)
      .fill(null)
      .map((_, i) =>
        createMockSuperhero({
          id: `${i + 1}`,
          nickname: `Hero${i + 1}`,
        }),
      );

  // ==================== Module Setup ====================
  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockResolvedValue(createMockSuperhero()),
      findAll: jest.fn().mockResolvedValue([]),
      findPaginated: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
      findById: jest.fn().mockResolvedValue(createMockSuperhero()),
      updateById: jest.fn().mockResolvedValue(createMockSuperhero()),
      deleteById: jest.fn().mockResolvedValue(undefined),
      createImageRelations: jest.fn().mockResolvedValue(undefined),
      deleteAllImageRelations: jest.fn().mockResolvedValue(undefined),
    } as any as jest.Mocked<SuperheroRepository>;

    mockImagesService = {
      create: jest.fn().mockResolvedValue([]),
    } as any as jest.Mocked<ImagesService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroService,
        {
          provide: SuperheroRepository,
          useValue: mockRepository,
        },
        {
          provide: ImagesService,
          useValue: mockImagesService,
        },
      ],
    }).compile();

    service = module.get<SuperheroService>(SuperheroService);
  });

  // ==================== Smoke Tests ====================
  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  // ==================== CREATE Tests ====================
  describe('create', () => {
    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(createMockSuperhero());
    });

    it('should create superhero without images', async () => {
      const createDto: CreateSuperheroDto = {
        nickname: 'Spider-Man',
        realName: 'Peter Parker',
        originDescription: 'Bitten by a radioactive spider',
        superpowers: ['Wall-crawling', 'Spider-sense'],
        catchPhrase: 'Your friendly neighborhood Spider-Man!',
      };

      const createdSuperhero = createMockSuperhero({ id: '2' });
      const responseSuperhero = createMockSuperhero({ id: '2' });

      mockRepository.create.mockResolvedValue(createdSuperhero);
      mockRepository.findById.mockResolvedValue(responseSuperhero);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toBeDefined();
      expect(result.id).toBe('2');
    });

    it('should create superhero with images', async () => {
      const createDto: CreateSuperheroDto = {
        nickname: 'Hulk',
        realName: 'Bruce Banner',
        originDescription: 'Gamma radiation',
        superpowers: ['Strength'],
        catchPhrase: 'Hulk smash!',
      };
      const files = [{ originalname: 'hulk.jpg' }] as Express.Multer.File[];
      const mockImage = createMockImage();
      const superheroWithImages = createMockSuperheroWithImages();

      mockRepository.create.mockResolvedValue(superheroWithImages);
      mockImagesService.create.mockResolvedValue([mockImage]);
      mockRepository.createImageRelations.mockResolvedValue(undefined);
      mockRepository.findById.mockResolvedValue(superheroWithImages);

      const result = await service.create(createDto, files);

      expect(mockImagesService.create).toHaveBeenCalledWith(files);
      expect(mockRepository.createImageRelations).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle creation without optional files parameter', async () => {
      const createDto: CreateSuperheroDto = {
        nickname: 'Black Widow',
        realName: 'Natasha Romanoff',
        originDescription: 'Spy training',
        superpowers: ['Martial arts'],
        catchPhrase: 'I retire from everything!',
      };

      const createdSuperhero = createMockSuperhero();
      mockRepository.create.mockResolvedValue(createdSuperhero);
      mockRepository.findById.mockResolvedValue(createdSuperhero);

      const result = await service.create(createDto);

      expect(mockImagesService.create).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  // ==================== FIND ALL Tests ====================
  describe('findAll', () => {
    it('should return all superheroes', async () => {
      const heroes = createMultipleMockSuperheroes(3);
      mockRepository.findAll.mockResolvedValue(heroes);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(heroes);
      expect(result.length).toBe(3);
    });

    it('should return empty array when no superheroes exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ==================== PAGINATE Tests ====================
  describe('paginate', () => {
    const ITEMS_PER_PAGE = 5;
    const TOTAL_HEROES = 10;

    beforeEach(() => {
      const page1Heroes = createMultipleMockSuperheroes(ITEMS_PER_PAGE);
      mockRepository.findPaginated.mockResolvedValue(page1Heroes);
      mockRepository.count.mockResolvedValue(TOTAL_HEROES);
    });

    it('should return paginated superheroes with metadata', async () => {
      const result = await service.paginate(1, ITEMS_PER_PAGE);

      expect(mockRepository.findPaginated).toHaveBeenCalledWith(0, ITEMS_PER_PAGE);
      expect(mockRepository.count).toHaveBeenCalled();
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total', TOTAL_HEROES);
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('totalPages', 2);
    });

    it('should throw BadRequestException for out of range page', async () => {
      mockRepository.findPaginated.mockResolvedValue([]);

      await expect(service.paginate(2, ITEMS_PER_PAGE)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should calculate correct total pages', async () => {
      const result = await service.paginate(1, ITEMS_PER_PAGE);

      const expectedTotalPages = Math.ceil(TOTAL_HEROES / ITEMS_PER_PAGE);
      expect(result.totalPages).toBe(expectedTotalPages);
    });

    it('should handle single item pagination', async () => {
      mockRepository.findPaginated.mockResolvedValue([createMockSuperhero()]);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.paginate(1, ITEMS_PER_PAGE);

      expect(result.totalPages).toBe(1);
      expect(result.data.length).toBe(1);
    });

    it('should calculate skip correctly for page 2', async () => {
      mockRepository.findPaginated.mockResolvedValue([createMockSuperhero()]);
      mockRepository.count.mockResolvedValue(TOTAL_HEROES);

      await service.paginate(2, ITEMS_PER_PAGE);

      const expectedSkip = (2 - 1) * ITEMS_PER_PAGE;
      expect(mockRepository.findPaginated).toHaveBeenCalledWith(
        expectedSkip,
        ITEMS_PER_PAGE,
      );
    });
  });

  // ==================== FIND ONE Tests ====================
  describe('findOne', () => {
    const VALID_ID = '1';
    const INVALID_ID = '999';

    it('should return superhero with all details and images', async () => {
      const superheroWithImages = createMockSuperheroWithImages();
      mockRepository.findById.mockResolvedValue(superheroWithImages);

      const result = await service.findOne(VALID_ID);

      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(result).toBeDefined();
      expect(result.id).toBe(superheroWithImages.id);
      expect(result.nickname).toBe(superheroWithImages.nickname);
    });

    it('should return superhero without images', async () => {
      const superheroWithoutImages = createMockSuperhero();
      mockRepository.findById.mockResolvedValue(superheroWithoutImages);

      const result = await service.findOne(VALID_ID);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('nickname');
    });

    it('should throw NotFoundException when superhero does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(INVALID_ID)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findById).toHaveBeenCalledWith(INVALID_ID);
    });

    it('should include all superhero properties in response', async () => {
      const superhero = createMockSuperhero();
      mockRepository.findById.mockResolvedValue(superhero);

      const result = await service.findOne(VALID_ID);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('nickname');
      expect(result).toHaveProperty('realName');
      expect(result).toHaveProperty('originDescription');
      expect(result).toHaveProperty('superpowers');
      expect(result).toHaveProperty('catchPhrase');
    });
  });

  // ==================== UPDATE Tests ====================
  describe('update', () => {
    const VALID_ID = '1';
    const INVALID_ID = '999';

    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(createMockSuperhero());
      mockRepository.updateById.mockResolvedValue(createMockSuperhero());
    });

    it('should update superhero properties only', async () => {
      const updateDto: UpdateSuperheroDto = {
        nickname: 'Iron Man Mark II',
      };

      await service.update(VALID_ID, updateDto);

      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.updateById).toHaveBeenCalledWith(VALID_ID, updateDto);
    });

    it('should replace images when files are provided', async () => {
      const updateDto: UpdateSuperheroDto = { nickname: 'Updated' };
      const newFiles = [
        { originalname: 'new1.jpg' },
        { originalname: 'new2.jpg' },
      ] as Express.Multer.File[];
      const mockImage = createMockImage();

      mockImagesService.create.mockResolvedValue([mockImage]);

      await service.update(VALID_ID, updateDto, newFiles);

      expect(mockRepository.deleteAllImageRelations).toHaveBeenCalledWith(VALID_ID);
      expect(mockImagesService.create).toHaveBeenCalledWith(newFiles);
      expect(mockRepository.createImageRelations).toHaveBeenCalled();
    });

    it('should clear all images when empty array is provided', async () => {
      const updateDto: UpdateSuperheroDto = {};
      const emptyFiles: Express.Multer.File[] = [];

      await service.update(VALID_ID, updateDto, emptyFiles);

      expect(mockRepository.deleteAllImageRelations).toHaveBeenCalledWith(VALID_ID);
      expect(mockImagesService.create).not.toHaveBeenCalled();
    });

    it('should not touch images when files parameter is not provided', async () => {
      const updateDto: UpdateSuperheroDto = { nickname: 'New Name' };

      await service.update(VALID_ID, updateDto);

      expect(mockRepository.deleteAllImageRelations).not.toHaveBeenCalled();
      expect(mockImagesService.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if superhero does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);
      const updateDto: UpdateSuperheroDto = { nickname: 'New Name' };

      await expect(service.update(INVALID_ID, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.updateById).not.toHaveBeenCalled();
    });

    it('should allow empty update dto', async () => {
      const emptyDto: UpdateSuperheroDto = {};

      await service.update(VALID_ID, emptyDto);

      expect(mockRepository.updateById).toHaveBeenCalledWith(VALID_ID, emptyDto);
    });
  });

  // ==================== REMOVE Tests ====================
  describe('remove', () => {
    const VALID_ID = '1';
    const INVALID_ID = '999';

    beforeEach(() => {
      mockRepository.findById.mockResolvedValue(createMockSuperhero());
      mockRepository.deleteById.mockResolvedValue(createMockSuperhero());
    });

    it('should delete superhero successfully', async () => {
      await service.remove(VALID_ID);

      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.deleteById).toHaveBeenCalledWith(VALID_ID);
    });

    it('should throw NotFoundException when superhero does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.remove(INVALID_ID)).rejects.toThrow(NotFoundException);
      expect(mockRepository.deleteById).not.toHaveBeenCalled();
    });
  });
});