// src/components/SuperheroForm.tsx
'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { Superhero } from '@/types';

export default function SuperheroForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<Superhero>;
  onSubmit: (data: FormData) => void;
}) {
  const [formData, setFormData] = useState({
    nickname: initialData?.nickname || '',
    realName: initialData?.realName || '',
    originDescription: initialData?.originDescription || '',
    superpowers: Array.isArray(initialData?.superpowers)
      ? initialData.superpowers.join(', ')
      : (initialData?.superpowers as unknown as string) || '',
    catchPhrase: initialData?.catchPhrase || '',
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    newFiles.forEach(file => {
      data.append('images', file);
    });

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero Identity */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium text-white mb-4">Hero Identity</h2>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
              Hero Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="e.g. Superman"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="realName" className="block text-sm font-medium text-gray-300">
              Real Name *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="realName"
                name="realName"
                value={formData.realName}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="e.g. Clark Kent"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="catchPhrase" className="block text-sm font-medium text-gray-300">
              Catch Phrase *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="catchPhrase"
                name="catchPhrase"
                value={formData.catchPhrase}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="“Look, up in the sky...”"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Origin & Powers */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium text-white mb-4">Origin & Abilities</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="originDescription" className="block text-sm font-medium text-gray-300">
              Origin Story *
            </label>
            <div className="mt-1">
              <textarea
                id="originDescription"
                name="originDescription"
                rows={4}
                value={formData.originDescription}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="Describe the hero's origin..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="superpowers" className="block text-sm font-medium text-gray-300">
              Superpowers *
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="superpowers"
                name="superpowers"
                value={formData.superpowers}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
                placeholder="flight, heat vision, super strength"
              />
              <p className="mt-1 text-sm text-gray-400">
                Separate powers with commas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium text-white mb-4">Hero Images</h2>
        <ImageUpload
          existingImages={initialData?.images || []}
          onFilesChange={setNewFiles}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {initialData ? 'Update Hero' : 'Create Hero'}
        </button>
      </div>
    </form>
  );
}