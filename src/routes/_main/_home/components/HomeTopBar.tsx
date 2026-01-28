// src/routes/_home/components/HomeTopBar.tsx
const PRIMARY = "#5B5DEB";

export default function HomeTopBar() {
  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex h-12 items-center px-4">
        {/* left spacer */}
        <div className="h-9 w-9" />

        {/* center */}
        <div className="flex flex-1 items-center justify-center gap-1">
          <span className="text-[15px] font-semibold" style={{ color: PRIMARY }}>
            Real Match
          </span>
        </div>

        {/* right bell */}
        <button type="button" aria-label="alarm" className="grid h-9 w-9 place-items-center">
          <span className="text-[18px] text-black/70">🔔</span>
        </button>
      </div>
      <div className="h-px w-full bg-black/5" />
    </header>
  );
}
