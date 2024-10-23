import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { fileRoute } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: `${process.env.NEXT_WEB_NAME}: %s`,
    default: process.env.NEXT_WEB_NAME!
  },
  description: process.env.NEXT_WEB_DESC,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRoute)} />
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
