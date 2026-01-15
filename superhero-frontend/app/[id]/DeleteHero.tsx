'use client'

import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DeleteHero({ id }: { id: string }) {
  const router = useRouter();
  
  const handleDelete = async () => {
    await api.deleteSuperhero(id);
    router.push('/');
  };

  return (
    <button
        onClick={handleDelete}
        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-red-500 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden"
        >
        Delete
    </button>
  );
}