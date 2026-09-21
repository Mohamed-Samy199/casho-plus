
import { useEffect, useRef, useState } from "react";
import { useScrubVideo } from "../../hooks/useScrubVideo";

// Below this width we swap to a second clip where the mascot is framed
// centered instead of left-anchored — the left-framed clip crops badly
// on narrow screens, so a dedicated centered version reads better there.
const MOBILE_BREAKPOINT = 768; // px

export default function Hero() {
  const videoRef = useRef(null);
  const { isReady, mode } = useScrubVideo(videoRef);

  const [isSmallScreen, setIsSmallScreen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = (event) => setIsSmallScreen(event.matches);

    handleChange(mql); // sync once in case it changed before the listener attached
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Desktop: mascot on the left, empty space on the right for the Arabic copy.
  // Small screens: same character, but the centered-framing clip instead.
  const videoSrc = isSmallScreen ? "/casho.webm" : "/casho-head.mp4";

  return (
    <section
      id="home"
      className="relative h-[100svh] w-full overflow-hidden bg-casho-ink"
    >
      {/* Locked-camera video. Source swaps by screen size (see videoSrc above);
          framing itself is baked into each clip, no CSS pan/zoom here. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transformOrigin: "center center",
          backgroundColor: "#0565b3",
        }}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Fallback color while the video decodes its first frame */}
      <div
        className={`absolute inset-0 bg-casho-blue-dark transition-opacity duration-700 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Readability overlay over the video.
          Small screens: flat solid tint across the whole frame (the mascot
          clip is centered here, so a side-gradient would leave the middle
          unprotected — a flat layer guards the text no matter where a
          light patch in the video lands).
          Larger screens: the original left-to-right gradient, since the
          mascot stays clear of the text there and doesn't need covering. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full"
        style={{
          background: isSmallScreen
            ? "rgba(6,32,56,0.78)"
            : "linear-gradient(to left, rgba(6,32,56,0.78) 0%, rgba(6,32,56,0.55) 35%, rgba(6,32,56,0.15) 70%, rgba(6,32,56,0) 100%)",
        }}
      />

      {/* Soft base gradient for footer-edge legibility of nav / hint text */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-casho-ink/50 to-transparent" />

      {/* Text content — anchored to the right, over the empty half of the frame */}
      <div className="absolute inset-y-0 right-0 flex w-full items-center px-5 sm:w-3/4 sm:px-10 lg:w-1/2 lg:px-16">
        <div className="max-w-xl animate-fade-in text-right">
          <p className="mb-4 inline-block rounded-full border border-casho-yellow/40 bg-casho-yellow/10 px-4 py-1.5 text-sm font-semibold text-casho-yellow">
            محفظتك الإلكترونية المصرية
          </p>

          <h1 className="text-4xl font-black leading-[1.15] text-white sm:text-5xl lg:text-[3.4rem]">
           كل خدماتك 
            <br />
            في مكان واحد
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl">
             خدمات حكومية ,تحويلات ومدفوعات إلكترونية بسرعة وأمان، مع كاشو بلس أقرب ليك في كل
            معاملة.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="rounded-full bg-casho-yellow px-8 py-3.5 text-[.8rem] md:text-base font-bold text-casho-blue-dark shadow-[0_8px_24px_rgba(255,210,31,0.35)] transition-transform hover:scale-[1.04]"
            >
              اكتشف خدماتنا
            </a>
            <a
              href="#contact"
              className="rounded-full border-2 border-white/70 px-8 py-3.5 text-[.8rem] md:text-base font-bold text-white backdrop-blur-sm transition-colors hover:border-casho-yellow hover:text-casho-yellow"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}