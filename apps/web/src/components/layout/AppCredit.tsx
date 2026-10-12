"use client";

import { useTranslations } from "next-intl";

export const AUTHOR_NAME = "Hàn Kim Thủy";
export const AUTHOR_URL = "https://hankimthuy.com/en/connect";

export default function AppCredit({ className = "" }: { className?: string }) {
  const t = useTranslations("Common.credit");
  const year = new Date().getFullYear();

  return (
    <footer className={`py-6 text-center text-xs text-slate-500 ${className}`}>
      <p>{t("copyright", { year })}</p>
      <p className="mt-1">
        {t("madeBy")}{" "}
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline"
        >
          {AUTHOR_NAME}
        </a>
      </p>
    </footer>
  );
}
