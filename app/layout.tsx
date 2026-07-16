import type { Metadata } from "next";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin", "latin-ext"], variable: "--font-newsreader", weight: ["400", "500"] });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "FINIX - finančné služby - hypotéky, investície, poistenie",
  description: "Vaše financie v jasných číslach.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body className={`${newsreader.variable} ${inter.variable} ${plexMono.variable} font-sans bg-white text-brand-navy`}>
        {children}
      </body>
    </html>
  );
}
