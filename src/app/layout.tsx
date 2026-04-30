import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OF Formation — La formation bancaire et financière, conçue pour être comprise",
  description:
    "Organisme de formation certifié Qualiopi, spécialisé dans le secteur bancaire et financier. Micro-learning visuel, gamifié, conforme — financé par votre OPCO.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${poppins.variable} antialiased`}>
      <body className="bg-white text-[--color-text] font-sans">{children}</body>
    </html>
  );
}
