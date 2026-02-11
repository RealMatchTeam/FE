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
        onClick={() => navigate("/home")}
        className="absolute left-2 top-4 p-2"
        aria-label="back"
      >
        <img src={goBackIcon} alt="뒤로가기" className="h-6 w-6" />
      </button>

      <div className="absolute -bottom-8 left-5 z-10">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#E6E6F3] bg-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
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
