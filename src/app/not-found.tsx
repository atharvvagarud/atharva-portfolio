import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFoundContent } from "@/data/not-found";

export default function NotFound() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-page__content">
        <span className="not-found-page__dot" aria-hidden="true" />
        <p className="not-found-page__code">{notFoundContent.code}</p>
        <h1 id="not-found-title">{notFoundContent.heading}</h1>
        <div className="not-found-page__supporting">
          {notFoundContent.supportingText.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <Link
          className="button-primary not-found-page__home"
          href={notFoundContent.action.href}
        >
          {notFoundContent.action.label}
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
