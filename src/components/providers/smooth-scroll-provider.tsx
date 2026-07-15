"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { useEffect, useState, type ReactNode } from "react";

const lenisOptions = {
  duration: 1,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
  anchors: true,
  autoRaf: true,
  stopInertiaOnNavigate: true,
} as const;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");

    const updatePreference = () => {
      setIsEnabled(!reducedMotion.matches && !coarsePointer.matches);
    };

    updatePreference();
    reducedMotion.addEventListener("change", updatePreference);
    coarsePointer.addEventListener("change", updatePreference);

    return () => {
      reducedMotion.removeEventListener("change", updatePreference);
      coarsePointer.removeEventListener("change", updatePreference);
    };
  }, []);

  return (
    <>
      {children}
      {isEnabled ? <ReactLenis root options={lenisOptions} /> : null}
    </>
  );
}
