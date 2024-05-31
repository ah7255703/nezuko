import "./globals.css";
import { Metadata, Viewport } from "next";
import { arabicFont, latinFont } from "./fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { AppConfigProvider } from "./_data-providers/appConfig";
import { Dialoger, DialogerProvider } from "./_data-providers/dialoger";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Nezuko",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-svh h-svh max-h-svh w-svw max-w-full bg-background font-sans text-foreground antialiased",
          arabicFont.variable,
          latinFont.className,
        )}

      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppConfigProvider>
            <DialogerProvider>
              {children}
              <Dialoger />
            </DialogerProvider>
          </AppConfigProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
