"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
];

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const primaryImg = images?.[0] || DEFAULT_GALLERY[0];

  const imageList = [
    images?.[0] || DEFAULT_GALLERY[0],
    images?.[1] || DEFAULT_GALLERY[1],
    images?.[2] || DEFAULT_GALLERY[2],
    images?.[3] || DEFAULT_GALLERY[3],
  ];

  const [selectedImage, setSelectedImage] = useState(primaryImg);

  return (
    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Main Feature Image (Bento 4 cols) */}
      <div className="md:col-span-4 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 relative aspect-[4/3] bg-surface-container">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="w-full h-full object-cover"
          unoptimized={selectedImage.startsWith("http")}
        />
      </div>

      {/* Bento Thumbnail 1 */}
      <button
        onClick={() => setSelectedImage(imageList[0])}
        className={cn(
          "hidden md:block md:col-span-1 rounded-xl overflow-hidden border border-outline-variant/30 relative aspect-square text-left focus:outline-none transition-all",
          selectedImage === imageList[0] ? "ring-2 ring-primary border-primary scale-[1.02]" : "hover:border-primary/50 opacity-90"
        )}
      >
        <Image
          src={imageList[0]}
          alt={`${name} thumbnail 1`}
          fill
          sizes="200px"
          className="w-full h-full object-cover"
          unoptimized={imageList[0].startsWith("http")}
        />
      </button>

      {/* Bento Thumbnail 2 */}
      <button
        onClick={() => setSelectedImage(imageList[1])}
        className={cn(
          "hidden md:block md:col-span-1 rounded-xl overflow-hidden border border-outline-variant/30 relative aspect-square text-left focus:outline-none transition-all",
          selectedImage === imageList[1] ? "ring-2 ring-primary border-primary scale-[1.02]" : "hover:border-primary/50 opacity-90"
        )}
      >
        <Image
          src={imageList[1]}
          alt={`${name} thumbnail 2`}
          fill
          sizes="200px"
          className="w-full h-full object-cover"
          unoptimized={imageList[1].startsWith("http")}
        />
      </button>

      {/* Bento Thumbnail 3 (+4 Photos badge matching .design-ref) */}
      <button
        onClick={() => setSelectedImage(imageList[2])}
        className={cn(
          "hidden md:block md:col-span-2 rounded-xl overflow-hidden border border-outline-variant/30 relative aspect-[2/1] text-left focus:outline-none transition-all group",
          selectedImage === imageList[2] ? "ring-2 ring-primary border-primary scale-[1.02]" : "hover:border-primary/50 opacity-90"
        )}
      >
        <Image
          src={imageList[2]}
          alt={`${name} thumbnail 3`}
          fill
          sizes="400px"
          className="w-full h-full object-cover"
          unoptimized={imageList[2].startsWith("http")}
        />
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none group-hover:bg-primary/20 transition-colors">
          <span className="bg-white/90 px-4 py-2 rounded-full font-label-md text-label-md text-primary font-bold shadow-sm">
            +4 Photos
          </span>
        </div>
      </button>
    </div>
  );
}
