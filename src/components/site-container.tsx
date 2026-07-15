import { clsx } from "clsx";

type SiteContainerProps = React.ComponentPropsWithoutRef<"div">;

export function SiteContainer({ className, ...props }: SiteContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-[var(--site-max-width)] px-[var(--site-gutter)]",
        className,
      )}
      {...props}
    />
  );
}
