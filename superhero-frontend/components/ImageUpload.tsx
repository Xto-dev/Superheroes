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
    <div>
      <label className="block mb-2">Upload Images</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />
      
      <div className="flex flex-wrap gap-2">
        {existingImages.map((url, i) => (
          <img key={`existing-${i}`} src={url} alt="existing" className="w-16 h-16 object-cover" />
        ))}
        {previewUrls.map((url, i) => (
          <img key={`new-${i}`} src={url} alt="preview" className="w-16 h-16 object-cover" />
        ))}
      </div>
    </div>
  );
}