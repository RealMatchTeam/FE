function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className ?? ""}`}
    />
  );
}

export default function CampaignDetailSkeleton() {
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

        {/* Meta: D-day, quota, category */}
        <div className="mt-3 flex items-center gap-3">
          <Bone className="h-5 w-12" />
          <Bone className="h-5 w-10" />
          <Bone className="h-5 w-10" />
        </div>

        {/* Action bar */}
        <div className="mt-5 flex gap-3">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 w-11 rounded-xl" />
        </div>

        <div className="my-4 h-px w-full bg-bluegray-2" />

        {/* Campaign image */}
        <Bone className="h-[280px] w-full rounded-2xl" />

        {/* Campaign title */}
        <div className="mt-3 flex justify-center">
          <Bone className="h-6 w-48" />
        </div>

        {/* Detail rows */}
        <div className="py-5 space-y-3">
          <Bone className="h-5 w-20" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-4">
              <Bone className="h-4 w-[84px] shrink-0" />
              <Bone className="h-4 flex-1" />
            </div>
          ))}
        </div>

        <div className="my-6 mx-auto w-3/4 border-t border-bluegray-2" />

        {/* Content rows */}
        <div className="py-1 space-y-3">
          <Bone className="h-5 w-16" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Bone className="h-4 w-[84px] shrink-0" />
              <div className="flex-1 flex gap-2">
                <Bone className="h-7 w-16 rounded-full" />
                <Bone className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Apply button */}
        <Bone className="mt-8 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
