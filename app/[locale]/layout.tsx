import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";

const locales = ["en"];

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  const messages = locale === "en" ? enMessages : {};
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}