"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const imageList = images.length > 0 ? images : ["https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80"];
  const [selectedImage, setSelectedImage] = useState(imageList[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-md">
        <Image
          src={selectedImage}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails list if > 1 image */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={cn(
                "relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500",
                selectedImage === img
                  ? "border-purple-600 ring-2 ring-purple-600/30 scale-105"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${name} thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover object-center" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
