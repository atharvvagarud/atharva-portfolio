"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";

const APERTURE_DIAMETER = 32;
let hasPlayedInThisDocument = false;

function getCoverScale() {
  return Math.hypot(window.innerWidth, window.innerHeight) / APERTURE_DIAMETER + 0.1;
}

export function HeroCircleWipe() {
  const [isVisible, setIsVisible] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);
  const aperture = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const overlayElement = overlay.current;
      const apertureElement = aperture.current;

      if (!overlayElement || !apertureElement) {
        return;
      }

      const removeOverlay = () => {
        gsap.set(apertureElement, { clearProps: "willChange" });
        setIsVisible(false);
      };

      if (
        !document.querySelector(".home-hero") ||
        hasPlayedInThisDocument ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        hasPlayedInThisDocument = true;
        removeOverlay();
        return;
      }

      try {
        gsap.set(overlayElement, { display: "block" });
        gsap.set(apertureElement, { willChange: "transform" });

        const timeline = gsap.timeline({
          onComplete: () => {
            hasPlayedInThisDocument = true;
            window.removeEventListener("resize", finishOnResize);
            removeOverlay();
          },
        });

        const finishOnResize = () => {
          timeline.progress(1);
        };

        timeline.fromTo(
          apertureElement,
          { scale: 0.75 },
          {
            scale: getCoverScale,
            duration: 0.95,
            ease: "power4.inOut",
            force3D: true,
          },
        );

        window.addEventListener("resize", finishOnResize);

        return () => {
          window.removeEventListener("resize", finishOnResize);
          timeline.kill();
        };
      } catch {
        hasPlayedInThisDocument = true;
        removeOverlay();
      }
    },
    { scope: overlay },
  );

  return isVisible ? (
    <>
      <div className="hero-circle-wipe" ref={overlay} aria-hidden="true">
        <div className="hero-circle-wipe__aperture" ref={aperture} />
      </div>
      <noscript>
        <style>{`.hero-circle-wipe { display: none !important; }`}</style>
      </noscript>
    </>
  ) : null;
}
