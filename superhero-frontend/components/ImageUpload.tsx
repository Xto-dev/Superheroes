'use client';

import { useState } from 'react';

export default function ImageUpload({
  onFilesChange,
  existingImages = [],
}: {
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesChange(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  return (
<div className="space-y-4">
  <label className="block text-sm font-medium text-gray-100">Upload Images</label>

    <label
      htmlFor="image-upload"
      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition"
    >
      Choose Files
    </label>
    <input
      id="image-upload"
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />

    {existingImages.length > 0 && (
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-100 mb-2">Existing images:</p>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((url, i) => (
            <div key={`existing-${i}`} className="relative">
              <img
                src={url}
                alt="existing"
                className="w-16 h-16 object-cover rounded-md border border-gray-200 shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {previewUrls.length > 0 && (
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-100 mb-2">New images (preview):</p>
        <div className="flex flex-wrap gap-2">
          {previewUrls.map((url, i) => (
            <div key={`new-${i}`} className="relative">
              <img
                src={url}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md border border-gray-200 shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>
    )}
</div>
  );
}