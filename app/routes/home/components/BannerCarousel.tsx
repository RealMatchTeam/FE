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

export default function BannerCarousel({
  category,
  loading,
}: {
  category: CategoryKey;
  loading?: boolean;
}) {
  const banners = category === "beauty" ? beautyBanners : fashionBanners;
  const displayBanners = [banners[banners.length - 1], ...banners, banners[0]];

  const [current, setCurrent] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isSilentJumping, setIsSilentJumping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, INTERVAL);
  }, [stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const handleTransitionEnd = () => {
    if (current === 0) {
      setIsSilentJumping(true);
      setCurrent(banners.length);
    } else if (current === banners.length + 1) {
      setIsSilentJumping(true);
      setCurrent(1);
    }
  };

  useEffect(() => {
    if (isSilentJumping) {
      const timeout = setTimeout(() => {
        setIsSilentJumping(false);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isSilentJumping]);

  if (loading) {
    return (
      <div className="-mx-5 h-62.5 animate-pulse bg-gray-100" />
    );
  }

  const handleStart = (clientX: number) => {
    stop();
    setIsDragging(true);
    setStartX(clientX);
    setDragOffset(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (dragOffset > threshold) {
      setCurrent((prev) => prev - 1);
    } else if (dragOffset < -threshold) {
      setCurrent((prev) => prev + 1);
    }

    setIsDragging(false);
    setDragOffset(0);
    start();
  };

  const activeDotIndex = (current - 1 + banners.length) % banners.length;

  return (
    <div className="-mx-5">
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div
          className={`flex ${isDragging || isSilentJumping ? "" : "transition-transform duration-500 ease-in-out"}`}
          style={{
            transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayBanners.map((banner, i) => (
            <div
              key={`${category}-${i}`}
              className="w-full shrink-0 select-none"
            >
              <img
                src={banner.src}
                alt={banner.alt}
                className="h-62.5 w-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stop();
                setCurrent(i + 1);
                start();
              }}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeDotIndex ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
