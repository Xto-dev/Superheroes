export interface Superhero {
  id: string;
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string[];
  catchPhrase: string;
  images: string[];
}

export interface SuperheroListItem {
  id: string;
  nickname: string;
  image: string;
}

export interface PaginatedSuperheroes {
  data: SuperheroListItem[];
  total: number;
  page: number;
  totalPages: number;
}