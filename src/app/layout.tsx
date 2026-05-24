import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { appLocale } from "@/lib/app-locale";
import localFont from "next/font/local";
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontSans = Geist({
  subsets: ["latin"],
});

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
      className={cn(
        "h-full",
        "antialiased",
        fontSans.className,
        inter.variable,
        "font-sans",
      )}
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
