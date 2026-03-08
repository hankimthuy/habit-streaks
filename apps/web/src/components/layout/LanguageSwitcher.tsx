"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/app/actions/locale";
import MaterialIcon from "@/components/icons/MaterialIcon";

export default function LanguageSwitcher() {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();

    const toggleLanguage = () => {
        const nextLocale = locale === "en" ? "vi" : "en";
        startTransition(() => {
            setUserLocale(nextLocale);
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium border-2 transition-colors ${isPending
                    ? "opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
            title={locale === "en" ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh"}
        >
            <MaterialIcon name="language" className="text-lg" />
            <span className="uppercase">{locale}</span>
        </button>
    );
}
