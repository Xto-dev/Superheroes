import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import UpdateHeroForm from './UpdateHeroForm';

export default async function UpdateHeroPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const hero = await api.getSuperhero(resolvedParams.id).catch(() => null);
  if (!hero) return notFound();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Superhero</h1>
      <UpdateHeroForm hero={hero} heroId={resolvedParams.id} />
    </div>
  );
}