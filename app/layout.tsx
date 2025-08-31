import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/context/ToastContext";
import { QueryProvider } from "@/providers/QueryProvider";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import { SocketProvider } from "@/context/SocketProvider";
import { GlobalRouteLoading } from "@/components/common/GlobalRouteLoading";


export const metadata: Metadata = {
  title: "TaskFlow - Fast Task Management",
  description: "Lightning-fast task management and collaboration platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground transition-colors duration-300">
        <ClientSessionProvider>
          <ThemeProvider>
            <QueryProvider>
              <SocketProvider>
                <ToastProvider>
                  <GlobalRouteLoading />
                  {children}
                </ToastProvider>
              </SocketProvider>
            </QueryProvider>
          </ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}