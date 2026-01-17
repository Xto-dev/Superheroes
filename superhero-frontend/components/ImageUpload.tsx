'use client';

import { useState, useRef } from 'react';

type ImageItem = 
  | { type: 'existing'; url: string }
  | { type: 'new'; file: File; previewUrl: string };

export default function ImageUpload({
  setNewFiles,
  setExistedFiles,
  setOrderFiles,
  existingImages = [],
}: {
  setNewFiles: any;
  setExistedFiles: any;
  setOrderFiles: any;
  existingImages?: string[];
}) {
  const [images, setImages] = useState<ImageItem[]>(() =>
    existingImages.map(url => ({ type: 'existing', url }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalImageCount = images.length;

  const updateStates = (updated: any[]) => {
    setImages(updated);

    const orderImages = updated.map(item => item.type === "new" ? item.file.name : item.url);
    setOrderFiles(orderImages);

    const allNewFiles = updated
      .filter((item): item is { type: 'new'; file: File; previewUrl: string } => item.type === 'new')
      .map(item => item.file);
    setNewFiles(allNewFiles);

    const allExistedFiles = updated
      .filter((item): item is { type: 'existing'; url: string } => item.type === 'existing')
      .map(item => item.url);
    setExistedFiles(allExistedFiles);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (totalImageCount >= 5) return;

    const remainingSlots = 5 - totalImageCount;
    const filesToUse = newFiles.slice(0, remainingSlots);

    const newItems: ImageItem[] = filesToUse.map(file => ({
      type: 'new',
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newItems];

    updateStates(updatedImages);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    const removed = updated.splice(index, 1)[0];

    if (removed.type === 'new') {
      URL.revokeObjectURL(removed.previewUrl);
    }

    updateStates(updated);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    
    updateStates(updated);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    moveImage(fromIndex, toIndex);
  };

  const canAddMore = totalImageCount < 5;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-100">Upload Images (max 5)</label>

      <label
        htmlFor="image-upload"
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transition ${
          canAddMore
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
      >
        Choose Files
      </label>

      <input
        id="image-upload"
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={!canAddMore}
        className="hidden"
      />

      {totalImageCount > 0 && (
        <div className="mt-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((item, index) => (
              <div
                key={item.type === 'existing' ? `existing-${item.url}` : `new-${item.previewUrl}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="relative flex-shrink-0 w-16 h-16 rounded-md border border-gray-200 shadow-sm"
              >
                <img
                  src={item.type === 'existing' ? item.url : item.previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!canAddMore && (
        <p className="text-xs text-gray-400">Maximum 5 images allowed.</p>
      )}
    </div>
  );
}