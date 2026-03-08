import type { Metadata, Viewport } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = await getMessages() as any;
  const t = messages?.Dashboard;

  return {
    title: t?.title || "FlowStreaks",
    description: t?.description || "Track your habits, build streaks, earn rewards.",
    manifest: "/manifest.json",
    icons: {
      icon: "/logo.jpg",
      apple: "/logo.jpg",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18181b",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FlowStreaks" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <div className="relative min-h-screen flex flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl border-x border-slate-200 dark:border-slate-800">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
