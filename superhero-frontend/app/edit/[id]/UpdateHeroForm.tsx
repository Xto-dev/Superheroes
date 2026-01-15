'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import SuperheroForm from '@/components/SuperheroForm';
import { Superhero } from '@/types';

export default function UpdateHeroForm({ hero, heroId }: { hero: Superhero; heroId: string }) {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    await api.updateSuperhero(heroId, data);
    router.push('/');
  };

  return <SuperheroForm onSubmit={handleSubmit} initialData={ hero } />;
}