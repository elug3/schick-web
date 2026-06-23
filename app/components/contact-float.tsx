import { KAKAO_URL, TELEGRAM_URL } from "../lib/contact";
import { useLanguage } from "../lib/i18n";

export function ContactFloat() {
  const { t } = useLanguage();

  return (
    <div
      className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 md:bottom-6 md:right-6"
      aria-label={t("contact.us")}
    >
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contact.telegram")}
        className="flex size-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
      >
        <TelegramIcon />
      </a>
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contact.kakao")}
        className="flex size-14 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-lg transition hover:scale-105 hover:shadow-xl"
      >
        <KakaoIcon />
      </a>
    </div>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.04 15.29 8.7 19c.43 0 .62-.18.84-.4l2.02-1.93 4.18 3.06c.77.42 1.31.2 1.5-.72l2.72-12.76h.01c.24-1.12-.4-1.56-1.12-1.3L2.6 9.44c-1.08.42-1.06 1.02-.18 1.29l4.9 1.53L18.6 7.1c.45-.28.86-.13.52.19" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.87 5.35 4.69 6.78-.19.7-.69 2.52-.79 2.91-.12.47.17.46.36.33.15-.1 2.39-1.62 3.36-2.28.55.08 1.12.13 1.7.13 5.52 0 10-3.58 10-8S17.52 3 12 3Z" />
    </svg>
  );
}
