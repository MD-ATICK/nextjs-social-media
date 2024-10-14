import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_WEB_NAME}`,
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
      <body
        className={`${montserrat.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}

        </ThemeProvider>
      </body>
    </html>
  );
}
