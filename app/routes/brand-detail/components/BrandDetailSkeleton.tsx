function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className ?? ""}`}
    />
  );
}

export default function BrandDetailSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Hero image */}
      <Bone className="h-[200px] w-full rounded-none" />

      <div className="px-5 pb-10">
        {/* Logo + name + match rate */}
        <div className="flex items-center gap-3 mt-4">
          <Bone className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bone className="h-5 w-32" />
            <Bone className="h-4 w-20" />
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-3 flex gap-2">
          <Bone className="h-6 w-16 rounded-full" />
          <Bone className="h-6 w-20 rounded-full" />
        </div>

        {/* Description */}
        <div className="mt-4 space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-3/4" />
        </div>

        {/* Action bar */}
        <div className="mt-5 flex gap-3">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 w-11 rounded-xl" />
        </div>

        <div className="my-4 h-px w-full bg-bluegray-2" />

        {/* Category */}
        <div className="py-5 space-y-3">
          <Bone className="h-5 w-20" />
          <div className="flex gap-2">
            <Bone className="h-8 w-16 rounded-full" />
            <Bone className="h-8 w-20 rounded-full" />
            <Bone className="h-8 w-14 rounded-full" />
          </div>
        </div>

        {/* Tag sections */}
        <div className="space-y-4">
          <Bone className="h-5 w-28" />
          <div className="space-y-3">
            <Bone className="h-4 w-16" />
            <div className="flex gap-2">
              <Bone className="h-7 w-16 rounded-full" />
              <Bone className="h-7 w-20 rounded-full" />
              <Bone className="h-7 w-14 rounded-full" />
            </div>
          </div>
        </div>

        <div className="-mx-5 mt-5 h-2 bg-bluegray-1" />

        {/* Campaign section */}
        <div className="py-5 space-y-3">
          <Bone className="h-5 w-36" />
          <Bone className="h-[120px] w-full rounded-xl" />
        </div>

        <div className="-mx-5 mt-5 h-2 bg-bluegray-1" />

        {/* Products section */}
        <div className="py-5 space-y-3">
          <Bone className="h-5 w-28" />
          <div className="flex gap-3">
            <Bone className="h-[100px] w-[100px] rounded-xl shrink-0" />
            <Bone className="h-[100px] w-[100px] rounded-xl shrink-0" />
            <Bone className="h-[100px] w-[100px] rounded-xl shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
