import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { appLocale } from "@/lib/app-locale";
import localFont from "next/font/local";

const vazirmatn = localFont({
  src: "../../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  weight: "300 900",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Better Dashboard",
    template: "%s · Better Dashboard",
  },
  description:
    "Reusable Better Auth organization dashboard template for Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={appLocale.lang}
      dir={appLocale.dir}
      className={cn("h-full", "antialiased", "font-sans", vazirmatn.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction={appLocale.dir}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
