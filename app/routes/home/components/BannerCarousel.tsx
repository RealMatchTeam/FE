import { useEffect, useRef, useState, useCallback } from "react";
import type { CategoryKey } from "../types";
import bannerBeauty1 from "../../../assets/home-banner/banner-beauty-1.svg";
import bannerBeauty2 from "../../../assets/home-banner/banner-beauty-2.svg";
import bannerBeauty3 from "../../../assets/home-banner/banner-beauty-3.svg";
import bannerFashion1 from "../../../assets/home-banner/banner-fashion-1.svg";
import bannerFashion2 from "../../../assets/home-banner/banner-fashion-2.svg";
import bannerFashion3 from "../../../assets/home-banner/banner-fashion-3.svg";

const INTERVAL = 3000;

interface BannerItem {
  src: string;
  alt: string;
}

const beautyBanners: BannerItem[] = [
  { src: bannerBeauty1, alt: "뷰티 배너 1" },
  { src: bannerBeauty2, alt: "뷰티 배너 2" },
  { src: bannerBeauty3, alt: "뷰티 배너 3" },
];

const fashionBanners: BannerItem[] = [
  { src: bannerFashion1, alt: "패션 배너 1" },
  { src: bannerFashion2, alt: "패션 배너 2" },
  { src: bannerFashion3, alt: "패션 배너 3" },
];

export default function BannerCarousel({ category }: { category: CategoryKey }) {
  const banners = category === "beauty" ? beautyBanners : fashionBanners;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, INTERVAL);
  }, [banners.length]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <div className="-mx-5 mb-4">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner, i) => (
            <div key={`${category}-${i}`} className="w-full shrink-0">
              <img
                src={banner.src}
                alt={banner.alt}
                className="h-62.5 w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                stop();
                setCurrent(i);
                start();
              }}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === current ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
