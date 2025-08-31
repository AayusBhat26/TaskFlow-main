import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

const locales = ["en", "te"];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  
  // Dynamic import to reduce initial bundle size
  const messages = locale === "te" 
    ? (await import("../../messages/te.json")).default
    : (await import("../../messages/en.json")).default;
    
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}