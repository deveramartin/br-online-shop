import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Navigation Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-4 w-48 rounded-lg" />
      </div>

      {/* Main Grid Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Bento Image Gallery Skeleton */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="md:col-span-4 aspect-[4/3] rounded-2xl w-full" />
          <Skeleton className="hidden md:block md:col-span-1 aspect-square rounded-xl w-full" />
          <Skeleton className="hidden md:block md:col-span-1 aspect-square rounded-xl w-full" />
          <Skeleton className="hidden md:block md:col-span-2 aspect-[2/1] rounded-xl w-full" />
        </div>

        {/* Product Detail Info Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <div className="flex items-center gap-4 pt-1">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />
          <Skeleton className="h-20 w-full rounded-xl" />

          <div className="space-y-4 pt-2">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-full" />
              <Skeleton className="h-14 flex-1 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-20 rounded-2xl w-full" />
            <Skeleton className="h-20 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
