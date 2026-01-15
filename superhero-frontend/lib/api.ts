import { PaginatedSuperheroes, Superhero } from "@/types";

const API_BASE = process.env.NEXT_DOCKER_API_URL || 'http://localhost:5000';

export const api = {
  async getSuperheroes(page: number = 1) {
    const res = await fetch(`${API_BASE}/superhero?page=${page}`);
    return res.json() as Promise<PaginatedSuperheroes>;
  },

  async getSuperhero(id: string) {
    const res = await fetch(`${API_BASE}/superhero/${id}`);
    if (res.status != 200) return null;
    return res.json() as Promise<Superhero>;
  },

  async createSuperhero(data: FormData) {
    const res = await fetch(`${API_BASE}/superhero`, {
      method: 'POST',
      body: data,
    });
    return res.json() as Promise<Superhero>;
  },

  async updateSuperhero(id: string, data: FormData) {
    const res = await fetch(`${API_BASE}/superhero/${id}`, {
      method: 'PATCH',
      body: data,
    });
    return res.json() as Promise<Superhero>;
  },

  async deleteSuperhero(id: string) {
    await fetch(`${API_BASE}/superhero/${id}`, { method: 'DELETE' });
  },
};