import { motion } from "framer-motion";

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Image skeleton */}
      <div className="relative h-36 sm:h-40 md:h-44 bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <div className="h-4 sm:h-5 bg-gray-200 rounded animate-pulse w-3/4" />

        {/* Description lines */}
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between mt-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MenuGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <MenuItemSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded animate-pulse w-64" />

      {/* Content blocks */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
      </div>

      {/* Card skeletons */}
      <div className="grid gap-4 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
