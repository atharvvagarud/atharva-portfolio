"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { LondonTime } from "@/components/london-time";
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
      <p>© {new Date().getFullYear()} Atharva Garud</p>
      <p>London, UK</p>
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
  const lastSelectedId = useRef<string | null>(null);
  const photoButtons = useRef<Record<string, HTMLButtonElement | null>>({});

  const visiblePhotos = useMemo(
    () =>
      activeFilter === "All"
        ? photos
        : photos.filter((photo) => photo.category === activeFilter),
    [activeFilter, photos],
  );

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
    if (!activePhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, closeViewer, navigate]);

  if (activePhoto) {
    const currentNumber = String(activeIndex + 1).padStart(2, "0");
    const totalNumber = String(visiblePhotos.length).padStart(2, "0");

    return (
      <section className="photo-viewer" aria-labelledby="photo-viewer-title">
        <div className="photo-viewer__layout">
          <figure className="photo-viewer__figure">
            <Image
              className="photo-viewer__image"
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width}
              height={activePhoto.height}
              sizes="(max-width: 767px) 100vw, 74vw"
              priority
            />
          </figure>

          <aside className="photo-viewer__panel" aria-label="Photograph details">
            <p className="section-label">02 / View</p>

            <div className="photo-viewer__introduction">
              <h1 id="photo-viewer-title">{activePhoto.title}</h1>
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
      </section>
    );
  }

  return (
    <>
      <div className="photography-page">
        <header className="photography-header">
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
        </header>

        <section className="photography-index" aria-labelledby="photography-index-title">
          <h2 className="sr-only" id="photography-index-title">
            Photography index
          </h2>

          <div className="photo-filters" aria-label="Filter photographs">
            {photoFilters.map((filter) => (
              <button
                className="photo-filter"
                type="button"
                key={filter}
                aria-pressed={activeFilter === filter}
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

          <div className="photo-grid">
            {visiblePhotos.map((photo) => (
              <button
                className="photo-tile"
                type="button"
                key={photo.id}
                ref={(element) => {
                  photoButtons.current[photo.id] = element;
                }}
                aria-label={`View ${photo.title}`}
                onClick={() => openPhoto(photo.id)}
              >
                <span className="photo-tile__image-wrap">
                  <Image
                    className="photo-tile__image"
                    src={photo.src}
                    alt=""
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 767px) 50vw, (max-width: 1199px) 25vw, 20vw"
                  />
                </span>
                <span className="photo-tile__caption">
                  <span>{photo.title}</span>
                  <span>{photo.location}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <PhotographyFooter />
    </>
  );
}
