import { useEffect, useRef, useState } from "react";

/**
 * Drives a <video> element's currentTime directly from horizontal mouse
 * position, with a small easing pass so the frame doesn't jitter.
 *
 * - clientX is stored in a ref and read inside a requestAnimationFrame loop
 *   (no state, no delta accumulation — every frame recomputes an absolute
 *   target time from the current mouse position).
 * - Touch / coarse-pointer devices skip scrubbing entirely and get a
 *   muted autoplaying loop instead.
 * - prefers-reduced-motion collapses everything to a single static frame.
 */
export function useScrubVideo(videoRef) {
  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState("scrub"); // "scrub" | "autoplay" | "static"

  const targetClientX = useRef(null);
  const smoothedTime = useRef(0);
  const rafId = useRef(null);

  // Decide interaction mode once, up front.
  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setMode("static");
    } else if (isCoarsePointer) {
      setMode("autoplay");
    } else {
      setMode("scrub");
    }
  }, []);

  // Prepare the video: load metadata, then pause on frame 0 for scrub/static modes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (mode === "autoplay") {
        video.currentTime = 0;
        video.muted = true;
        video.loop = true;
        video.play().catch(() => {
          /* autoplay can be blocked; silently ignore */
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
      setIsReady(true);
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [mode, videoRef]);

  // Mouse scrubbing loop.
  useEffect(() => {
    if (mode !== "scrub") return;
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = (event) => {
      targetClientX.current = event.clientX;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // How quickly the video "catches up" to the mouse — a rate per second,
    // not a per-frame fraction, so speed stays consistent across refresh rates.
    const CATCH_UP_RATE = 4.5;
    // Ignore sub-frame corrections smaller than this (in seconds) so the
    // seek doesn't fire on imperceptible changes and look twitchy.
    const DEAD_ZONE = 0.004;

    let lastFrameAt = performance.now();

    const tick = (now) => {
      const deltaSeconds = Math.min((now - lastFrameAt) / 1000, 0.1);
      lastFrameAt = now;

      const duration = video.duration;
      if (!isNaN(duration) && duration > 0 && targetClientX.current !== null) {
        const rawRatio = Math.min(
          1,
          Math.max(0, targetClientX.current / window.innerWidth)
        );
        // Mirror the axis: the mascot sits on the video's left, so moving
        // the mouse toward the right edge of the screen should scrub the
        // video *forward* the same way the mascot appears to lean toward
        // the cursor — without this flip the motion reads as reversed.
        const ratio = 1 - rawRatio;
        const targetTime = ratio * duration;

        // Frame-rate independent exponential ease: smooth on 60Hz and
        // 120Hz screens alike, instead of a fixed per-frame percentage
        // that snaps on slow frames and crawls on fast ones.
        const lerpFactor = 1 - Math.exp(-CATCH_UP_RATE * deltaSeconds);
        smoothedTime.current +=
          (targetTime - smoothedTime.current) * lerpFactor;

        if (Math.abs(video.currentTime - smoothedTime.current) > DEAD_ZONE) {
          video.currentTime = smoothedTime.current;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [mode, videoRef]);

  return { isReady, mode };
}