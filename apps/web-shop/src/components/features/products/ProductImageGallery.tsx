"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

const DEFAULT_GALLERY_FALLBACK = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const imageList =
    images && images.length > 0
      ? images
      : [DEFAULT_GALLERY_FALLBACK];

  const [selectedImage, setSelectedImage] = useState(imageList[0]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (imgUrl: string) => {
    setFailedImages((prev) => ({ ...prev, [imgUrl]: true }));
    if (selectedImage === imgUrl) {
      setSelectedImage(DEFAULT_GALLERY_FALLBACK);
    }
  };

  return (
    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Main Feature Image */}
      <div className="md:col-span-4 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 relative aspect-[4/3] bg-surface-container">
        <Image
          src={failedImages[selectedImage] ? DEFAULT_GALLERY_FALLBACK : selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="w-full h-full object-cover"
          onError={() => handleImageError(selectedImage)}
        />
      </div>

      {/* Thumbnails grid */}
      {imageList.map((img, idx) => {
        const isSelected = selectedImage === img;
        const currentSrc = failedImages[img] ? DEFAULT_GALLERY_FALLBACK : img;

        return (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "relative aspect-[4/3] rounded-xl overflow-hidden border transition-all text-left focus:outline-none",
              idx === 0 ? "md:col-span-1" : idx === 1 ? "md:col-span-1" : "md:col-span-2",
              isSelected
                ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                : "border-outline-variant/30 hover:border-primary/50 opacity-90"
            )}
          >
            <Image
              src={currentSrc}
              alt={`${name} preview ${idx + 1}`}
              fill
              sizes="200px"
              className="w-full h-full object-cover"
              onError={() => handleImageError(img)}
            />
          </button>
        );
      })}
    </div>
  );
}
