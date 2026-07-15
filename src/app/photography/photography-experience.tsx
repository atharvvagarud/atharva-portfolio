"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { LondonTime } from "@/components/london-time";
import { siteConfig } from "@/config/site";
import {
  photoFilters,
  type Photo,
  type PhotoFilter,
} from "@/data/photography";

type PhotographyExperienceProps = {
  photos: readonly Photo[];
};

function PhotographyFooter() {
  return (
    <footer className="photography-footer">
      <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      <p>{siteConfig.location}</p>
      <p className="photography-footer__status">
        <span className="status-dot" aria-hidden="true" />
        Available for work
      </p>
    </footer>
  );
}

export function PhotographyExperience({ photos }: PhotographyExperienceProps) {
  const [activeFilter, setActiveFilter] = useState<PhotoFilter>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const lastSelectedId = useRef<string | null>(null);
  const viewerHeading = useRef<HTMLHeadingElement | null>(null);
  const viewerWasOpen = useRef(false);
  const photoButtons = useRef<Record<string, HTMLButtonElement | null>>({});

  const visiblePhotos =
    activeFilter === "All"
      ? photos
      : photos.filter((photo) => photo.category === activeFilter);

  const activeIndex = selectedId
    ? visiblePhotos.findIndex((photo) => photo.id === selectedId)
    : -1;
  const activePhoto = activeIndex >= 0 ? visiblePhotos[activeIndex] : null;

  const openPhoto = (photoId: string) => {
    lastSelectedId.current = photoId;
    setSelectedId(photoId);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeViewer = useCallback(() => {
    const returnToId = lastSelectedId.current;
    setSelectedId(null);
    window.requestAnimationFrame(() => {
      if (returnToId) photoButtons.current[returnToId]?.focus();
    });
  }, []);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (activeIndex < 0 || visiblePhotos.length === 0) return;
      const nextIndex =
        (activeIndex + direction + visiblePhotos.length) % visiblePhotos.length;
      setSelectedId(visiblePhotos[nextIndex].id);
    },
    [activeIndex, visiblePhotos],
  );

  useEffect(() => {
    if (!activePhoto) {
      viewerWasOpen.current = false;
      return;
    }

    if (!viewerWasOpen.current) {
      viewerWasOpen.current = true;
      window.requestAnimationFrame(() => viewerHeading.current?.focus());
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigate(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, closeViewer, navigate]);

  if (activePhoto) {
    const currentNumber = String(activeIndex + 1).padStart(2, "0");
    const totalNumber = String(visiblePhotos.length).padStart(2, "0");

    return (
      <motion.section
        className="photo-viewer"
        aria-labelledby="photo-viewer-title"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.24 }}
      >
        <div className="photo-viewer__layout">
          <figure className="photo-viewer__figure">
            <Image
              className="photo-viewer__image"
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width}
              height={activePhoto.height}
              sizes="(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1599px) 74vw, 1184px"
            />
          </figure>

          <aside className="photo-viewer__panel" aria-label="Photograph details">
            <p className="section-label">02 / View</p>

            <div className="photo-viewer__introduction">
              <h1 ref={viewerHeading} id="photo-viewer-title" tabIndex={-1}>
                {activePhoto.title}
              </h1>
              <p>{activePhoto.summary}</p>
            </div>

            <dl className="photo-viewer__metadata">
              <div>
                <dt>Location</dt>
                <dd>{activePhoto.location}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{activePhoto.year}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{activePhoto.category}</dd>
              </div>
            </dl>

            <p className="photo-viewer__description">{activePhoto.description}</p>

            <div className="photo-viewer__navigation" aria-label="Photo navigation">
              <button type="button" onClick={() => navigate(-1)}>
                <ArrowLeft aria-hidden="true" size={17} strokeWidth={1.5} />
                Previous
              </button>
              <button type="button" onClick={() => navigate(1)}>
                Next
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.5} />
              </button>
            </div>

            <div className="photo-viewer__utility">
              <p aria-live="polite">
                {currentNumber} / {totalNumber}
              </p>
              <button type="button" onClick={closeViewer}>
                Close
                <X aria-hidden="true" size={18} strokeWidth={1.5} />
              </button>
            </div>
          </aside>
        </div>

        <PhotographyFooter />
      </motion.section>
    );
  }

  return (
    <>
      <div className="photography-page">
        <motion.header
          className="photography-header"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="photography-header__copy">
            <p className="section-label">01 / Photography</p>
            <h1>A quiet collection of places, moments and observations.</h1>
            <p className="photography-header__supporting">
              Photographs made while walking, travelling and paying attention to
              the spaces in between.
            </p>
          </div>

          <div className="location-block photography-header__location">
            <p>London, UK</p>
            <p>
              Local time
              <LondonTime />
            </p>
          </div>
        </motion.header>

        <section
          className="photography-index"
          aria-labelledby="photography-index-title"
        >
          <h2 className="sr-only" id="photography-index-title">
            Photography index
          </h2>

          <div className="photo-filters" role="group" aria-label="Filter photographs">
            {photoFilters.map((filter) => (
              <button
                className="photo-filter"
                type="button"
                key={filter}
                aria-pressed={activeFilter === filter}
                aria-controls="photography-grid"
                onClick={() => setActiveFilter(filter)}
              >
                <span
                  className="photo-filter__indicator"
                  aria-hidden="true"
                />
                {filter}
              </button>
            ))}
          </div>

          <p className="sr-only" aria-live="polite">
            {visiblePhotos.length} {visiblePhotos.length === 1 ? "photograph" : "photographs"} shown
          </p>

          <div className="photo-grid" id="photography-grid">
            {visiblePhotos.map((photo, index) => (
              <motion.button
                className="photo-tile"
                type="button"
                key={photo.id}
                ref={(element) => {
                  photoButtons.current[photo.id] = element;
                }}
                aria-label={`View ${photo.title}, ${photo.location}`}
                onClick={() => openPhoto(photo.id)}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.16 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.38,
                  delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.18),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="photo-tile__image-wrap">
                  <Image
                    className="photo-tile__image"
                    src={photo.src}
                    alt=""
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 767px) calc((100vw - 3.5rem) / 2), (max-width: 1199px) calc((100vw - 6.5rem) / 3), (max-width: 1599px) 20vw, 320px"
                  />
                </span>
                <span className="photo-tile__caption">
                  <span>{photo.title}</span>
                  <span>{photo.location}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      <PhotographyFooter />
    </>
  );
}
