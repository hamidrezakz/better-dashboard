import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { DirectionProvider } from "@/components/ui/direction";
import localFont from "next/font/local";

const vazirmatn = localFont({
  src: "../../public/fonts/Vazirmatn-VariableFont_wght.ttf",
  weight: "300 900",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn("h-full", "antialiased", "font-sans", vazirmatn.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <DirectionProvider direction="ltr">
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
