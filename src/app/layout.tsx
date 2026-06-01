import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { appLocale } from "@/lib/app-locale";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const vazirmatn = localFont({
  src: "../../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  weight: "300 900",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "داشبورد بهتر",
    template: "%s · داشبورد بهتر",
  },
  description:
    "قالب داشبورد سازمانی موبایل‌اول با Better Auth برای Next.js — سایدبار، فرم‌ها و چیدمان واکنش‌گرا.",
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
      className={cn("h-full", "antialiased", vazirmatn.variable, "font-sans")}
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
            <Toaster richColors closeButton position="top-center" />
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
