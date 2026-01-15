'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import SuperheroForm from '@/components/SuperheroForm';

export default function CreateHero() {
  const router = useRouter();

  const handleSubmit = async (data: FormData) => {
    await api.createSuperhero(data);
    router.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Superhero</h1>
      <SuperheroForm onSubmit={handleSubmit} />
    </div>
  );
}