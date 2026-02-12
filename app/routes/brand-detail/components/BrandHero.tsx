import { useNavigate } from "react-router";
import goBackIcon from "../../../assets/go-back.svg?url";

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
    <div className="relative h-[210px] w-full ">
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
        className="absolute left-2 top-4 p-2"
        aria-label="back"
      >
        <img src={goBackIcon} alt="뒤로가기" className="h-6 w-6" />
      </button>

      <div className="absolute -bottom-8 left-3 z-10">
        <div className="grid h-18 w-18 place-items-center overflow-hidden rounded-[20px] border border-core-2 bg-white">
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
