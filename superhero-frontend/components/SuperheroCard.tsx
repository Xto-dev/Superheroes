'use client';

import { SuperheroListItem } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

export default function SuperheroCard({ hero }: { hero: SuperheroListItem }) {
  const [imgSrc, setImgSrc] = useState(`${process.env.NEXT_PUBLIC_API_URL}${hero.image}`  || '/placeholder.jpg');
  
  const handleError = () => {
    setImgSrc('/placeholder.svg');
  };

  console.log(imgSrc)

  return (
    <Link href={`/${hero.id}`} className="group relative">
      <img 
        src={imgSrc} 
        alt={hero.nickname} 
        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-60"
        onError={handleError}
      />
      <h3 className="font-bold">{hero.nickname}</h3>
    </Link>
  );
}