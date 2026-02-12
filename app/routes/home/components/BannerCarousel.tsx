import { useEffect, useRef, useState, useCallback } from "react";
import bannerBeauty from "../../../assets/home-banner/banner-beauty.svg";
import bannerFashion from "../../../assets/home-banner/banner-fashion.svg";

const INTERVAL = 3000;

export default function BannerCarousel() {
  const banners = [
    { src: bannerBeauty, alt: "뷰티 배너" },
    { src: bannerFashion, alt: "패션 배너" },
    { src: null, alt: "준비중 배너" },
  ];

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
            <div key={i} className="w-full shrink-0">
              {banner.src ? (
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="h-62.5 w-full object-cover"
                />
              ) : (
                <div className="flex h-62.5 w-full items-center justify-center bg-bluegray-2 text-text-gray3">
                  준비중
                </div>
              )}
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