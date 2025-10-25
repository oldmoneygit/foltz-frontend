export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden border border-zinc-800 h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-zinc-800" />

      {/* Content Skeleton */}
      <div className="p-3 flex flex-col flex-grow space-y-2">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </div>

        {/* Prices Skeleton */}
        <div className="space-y-1.5 mt-auto">
          <div className="h-4 bg-zinc-800 rounded w-1/3" />
          <div className="h-5 bg-zinc-800 rounded w-1/2" />
          <div className="h-8 bg-zinc-800 rounded-full w-3/4" />
        </div>
      </div>
    </div>
  )
}
