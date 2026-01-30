import { useRouter } from "@tanstack/react-router";

type Props = {
  heroImageUrl: string;
  logoText: string;
};

export default function BrandHero({ heroImageUrl, logoText }: Props) {
  const router = useRouter();

  return (
    // ✅ overflow-hidden 제거 (로고가 잘리지 않게)
    <div className="relative h-[210px] w-full bg-bluegray-2">
      {/* ✅ 이미지만 overflow 처리 */}
      <div className="h-full w-full overflow-hidden">
        <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
      </div>

      {/* back */}
      <button
        type="button"
        onClick={() => router.history.back()}
        className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/80"
        aria-label="back"
      >
        ‹
      </button>

      {/* ✅ 로고: 배너 밖으로 내려와도 안 잘림 */}
      <div className="absolute -bottom-8 left-5 z-10">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
          <span className="text-[14px] font-semibold">{logoText}</span>
        </div>
      </div>
    </div>
  );
}
