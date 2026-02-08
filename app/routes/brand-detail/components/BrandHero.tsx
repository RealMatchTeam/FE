import { useNavigate } from "react-router";

type Props = {
  heroImageUrl?: string;
  logoImageUrl?: string;
  logoText: string;
};

export default function BrandHero({
  heroImageUrl,
  logoImageUrl,
  logoText,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative h-[210px] w-full bg-bluegray-2">
      <div className="h-full w-full overflow-hidden">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt="brand hero"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80"
        aria-label="back"
      >
        ‹
      </button>

      <div className="absolute -bottom-8 left-5 z-10">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
          {logoImageUrl ? (
            <img
              src={logoImageUrl}
              alt="brand logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center text-[14px] font-semibold leading-tight">
              {logoText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
