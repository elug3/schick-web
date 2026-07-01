import { useEffect, useState } from "react";

import { useLanguage } from "../lib/i18n";

const STORAGE_KEY = "dupli1_cookie_consent";

export function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-zinc-200 bg-white/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm md:px-8 md:py-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0 flex-1">
          <p
            id="cookie-banner-title"
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950"
          >
            {t("cookie.title")}
          </p>
          <p id="cookie-banner-description" className="text-xs leading-relaxed text-zinc-500">
            {t("cookie.description")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={decline}
            className="border border-zinc-200 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-950"
          >
            {t("cookie.decline")}
          </button>
          <button
            type="button"
            onClick={accept}
            className="bg-zinc-950 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-zinc-800"
          >
            {t("cookie.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
