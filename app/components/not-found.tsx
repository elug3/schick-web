import { Link } from "react-router";

type NotFoundAction = {
  label: string;
  to: string;
};

type NotFoundPageProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: NotFoundAction;
  secondaryAction?: NotFoundAction;
};

export function NotFoundPage({
  eyebrow = "404",
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
  primaryAction = { label: "Browse all bags", to: "/" },
  secondaryAction,
}: NotFoundPageProps) {
  return (
    <main className="flex min-h-[62vh] items-center justify-center px-4 py-16 text-center md:px-8">
      <section className="mx-auto max-w-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c8a96e]">
          {eyebrow}
        </p>
        <h1
          className="mt-4 text-5xl font-light tracking-tight text-zinc-950 md:text-7xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-zinc-400">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={primaryAction.to}
            className="inline-flex h-12 items-center justify-center bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
          >
            {primaryAction.label}
          </Link>
          {secondaryAction && (
            <Link
              to={secondaryAction.to}
              className="inline-flex h-12 items-center justify-center border border-zinc-200 px-8 text-xs font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
