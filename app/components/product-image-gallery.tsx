import { useEffect, useRef, type ReactNode } from "react";

type GalleryImage = {
  src: string;
  position: string;
};

type ProductImageGalleryProps = {
  images: GalleryImage[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  alt: string;
  badge?: ReactNode;
};

export function ProductImageGallery({
  images,
  activeIndex,
  onActiveIndexChange,
  alt,
  badge,
}: ProductImageGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const targetLeft = container.offsetWidth * activeIndex;
    if (Math.abs(container.scrollLeft - targetLeft) > 2) {
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [activeIndex]);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    if (slideWidth === 0) return;

    const index = Math.round(container.scrollLeft / slideWidth);
    if (index !== activeIndex && index >= 0 && index < images.length) {
      onActiveIndexChange(index);
    }
  }

  const activeImage = images[activeIndex];

  return (
    <div className="relative flex-1 overflow-hidden bg-zinc-50">
      {/* Mobile: swipeable carousel */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 snap-center snap-always"
            style={{ paddingBottom: "120%" }}
          >
            <img
              src={img.src}
              alt={i === activeIndex ? alt : ""}
              draggable={false}
              className={`absolute inset-0 h-full w-full object-cover ${img.position}`}
            />
          </div>
        ))}
      </div>

      {/* Desktop: single image */}
      <div className="relative hidden md:block" style={{ paddingBottom: "120%" }}>
        <img
          src={activeImage.src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${activeImage.position}`}
        />
      </div>

      {badge && (
        <div className="pointer-events-none absolute left-4 top-4 z-10">{badge}</div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1} of ${images.length}`}
              onClick={() => onActiveIndexChange(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                activeIndex === i ? "w-5 bg-zinc-950" : "w-1.5 bg-zinc-400",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
