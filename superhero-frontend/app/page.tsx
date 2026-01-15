import { api } from '@/lib/api';
import SuperheroCard from '@/components/SuperheroCard';
import Pagination from '@/components/Pagination';

async function HeroList({ page }: { page: number }) {
  const data = await api.getSuperheroes(page);
  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {data.data.map(hero => (
          <SuperheroCard key={hero.id} hero={hero} />
        ))}
      </div>
      <Pagination total={data.total} totalPages={data.totalPages} />
    </>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">Superheroes</h2>
      <HeroList page={page} />
    </div>
  );
}