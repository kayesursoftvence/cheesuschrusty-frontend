// src/components/test/shared/ImagePlaceholder.tsx
import type { JSX } from 'react';

interface ImagePlaceholderProps {
  imageUrl?: string;
  alt?: string;
}

export default function ImagePlaceholder({ imageUrl, alt = 'Task image' }: ImagePlaceholderProps): JSX.Element {
  if (imageUrl) {
    return (
      <div className="rounded-xl overflow-hidden mb-6 border-2 border-slate-600">
        <img src={imageUrl} alt={alt} className="w-full h-64 object-cover" />
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl h-64 flex items-center justify-center mb-6 relative overflow-hidden group">
      <div className="text-center z-10 relative">
        <i className="fas fa-image text-4xl text-slate-500 mb-2"></i>
        <div className="text-sm font-bold text-slate-400">Cloudinary Asset Placeholder</div>
      </div>
    </div>
  );
}