interface TechMarqueeProps {
  items: string[];
  reverse?: boolean;
}

/** Infinite, pause-on-hover marquee. Pure CSS (see .marquee-track in index.css). */
export function TechMarquee({ items, reverse = false }: TechMarqueeProps) {
  if (items.length === 0) return null;
  const row = [...items, ...items];
  return (
    <div className="marquee group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={`marquee-track flex w-max gap-3 ${reverse ? 'marquee-reverse' : ''}`}>
        {row.map((item, idx) => (
          <span
            key={`${item}-${idx}`}
            aria-hidden={idx >= items.length}
            className="whitespace-nowrap rounded-full border border-border bg-card/70 px-5 py-2 text-sm font-semibold text-foreground/80 shadow-sm backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
