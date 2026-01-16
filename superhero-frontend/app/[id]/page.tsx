import { api } from '@/lib/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteHero from './DeleteHero';

export default async function HeroDetail({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const hero = await api.getSuperhero(resolvedParams.id).catch(() => null);
  console.log(hero);
  if (!hero) return notFound();

  const imageStyles = [
    "row-span-1 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4",
    "row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden",
    "col-start-3 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden",
    "col-start-4 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden",
  ]

  return (
    <div className="container mx-auto p-4">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:gap-8 lg:px-8">
            {hero.images.map((url, i) => (
            <img
                key={i}
                alt = ""
                src={url}
                className={i <= imageStyles.length ? imageStyles[i] : imageStyles[imageStyles.length - 1]}
            />
           ))} 
        </div>
      
      {/* Hero info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{hero.nickname}</h1>
            <h2 className="text-1xl font-bold tracking-tight text-gray-200 sm:text-2xl">{hero.realName}</h2>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Hero options</h2>
            <Link
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden" 
                href={`/edit/${hero.id}`}
                >
                Edit
            </Link>
            <DeleteHero id = {resolvedParams.id} />
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description:</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-100">{hero.originDescription}</p>
              </div>

              <div className="space-y-6">
                <p className="text-base text-gray-100"><strong>Super powers: </strong>{hero.superpowers.join(', ')}</p>
              </div>

              <div className="space-y-6">
                <p className="text-base text-gray-100"><strong>Catch phrase: </strong>{hero.catchPhrase}</p>
              </div>
            </div>

          </div>
        </div>
    </div>
  );
}