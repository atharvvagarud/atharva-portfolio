"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";

const easeOut = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, amount: 0.16 } as const;

export function HeroReveal({ children, ...props }: HTMLMotionProps<"section">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function InitialRevealHeader({
  children,
  ...props
}: HTMLMotionProps<"header">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.header>
  );
}

export function SectionReveal({ children, ...props }: HTMLMotionProps<"section">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduceMotion ? 0 : 0.52, ease: easeOut }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function RevealArticle({
  children,
  delay = 0,
  ...props
}: HTMLMotionProps<"article"> & { delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        delay: reduceMotion ? 0 : delay,
        ease: easeOut,
      }}
      {...props}
    >
      {children}
    </motion.article>
  );
}
