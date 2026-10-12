"use client";

import { useTranslations } from "next-intl";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { AUTHOR_URL } from "@/components/layout/AppCredit";

/** Always-visible notice that this is a trial build without persistent storage. */
export default function DemoBanner() {
  const t = useTranslations("Common.demoBanner");

  return (
    <div className="sticky top-0 z-40 h-11 px-4 flex items-center justify-center gap-2 bg-primary text-white text-[11px] leading-tight text-center">
      <MaterialIcon name="science" className="text-base shrink-0" />
      <p>
        <span className="font-bold">{t("label")}</span> {t("message")}{" "}
        <a
          href={AUTHOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline underline-offset-2 whitespace-nowrap"
        >
          {t("cta")}
        </a>
      </p>
    </div>
  );
}
